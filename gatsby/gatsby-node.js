import path, { resolve } from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. get template for all page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2. query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // console.log(data);
  // 3. loop over each pizza and create a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    // console.log('Creating page for ', pizza.name);
    actions.createPage({
      // url for new page?
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        wes: 'is cool',
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // console.log('turning the toppings into pages!!!!!');
  // 1. get the template
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  // 2. query all the toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);

  // 3. createPage for that topping
  data.toppings.nodes.forEach((topping) => {
    // console.log(`creating page for ${topping.name}`);
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
  // 4. pass topping data to pizza.js
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
  // console.log('turning the masters into pages!');
  // 1. query all the slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // 2. turn each slicemaster into own page (TODO)
  data.slicemasters.nodes.forEach((slicemaster) => {
    actions.createPage({
      component: resolve('./src/templates/Slicemaster.js'),
      path: `/slicemaster/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current,
      },
    });
  });
  // 3. figure out how many pages there are based on how many slicemasters there are and how many per page!
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
  // console.log(
  //   `there will be ${data.slicemasters.totalCount} total people. And we have ${pageCount} pages with ${pageSize} per page!`
  // );
  // 4. loop from 1 to n and create the pages for the smaller lists
  Array.from({ length: pageCount }).forEach((_, index) => {
    // console.log(`creating page ${index}`);
    actions.createPage({
      path: `/slicemasters/${index + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      context: {
        skip: index * pageSize,
        currentPage: index + 1,
        pageSize,
      },
    });
  });
}
export async function createPages(params) {
  // create pages dynamically
  // 1. pizzas
  // 2. toppings
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params),
  ]);
  // 3. slicemasters
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  // 1. fetch list of beers
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();
  // console.log(beers);
  // 2. loop over each one
  for (const beer of beers) {
    // create node for each beer
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json', // other plugins will look for types like markdown!
        contentDigest: createContentDigest(beer),
      },
    };
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
  // 3. create a node for that beer
}

export async function sourceNodes(params) {
  // fetch list of beers and source them into gatsby API!
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}
