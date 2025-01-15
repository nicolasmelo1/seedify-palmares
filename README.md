# seedify-palmares

Like i already explained, the backend uses [Palmares](https://github.com/palmaresHQ/palmares), a framework i am developing on my free time. The structure of the backend follows the Domain Driver Design. Every domain is a folder and should be isolated from one another. Models, services, routes and
controllers should be in the same folder and will be just used in the domain.

[Palmares](https://github.com/palmaresHQ/palmares) does not try to reinvent the wheel for everything, it does everything at the same time it does nothing. You will see that everything depends on an adapter to function. So changing your schema library or the ORM you are currently using should be easy.

As you can see, everything is typesafe, so don't need to explicitly define the types yourself. Also, the core of the framework can be shared between environment as it does not have any external dependencies besides itself.

###### About manage.ts

It's the entrypoint of commands for the application. All commands should be run from this file, like

```bash
tsx manage.ts hello
```

###### The settings.ts

Everything is a domain as i have explained. See on `core`, `auth` and `inventory` folders that they always default export a domain.
In order to make those domains usable by your application you must install them on the `settings.ts` file. This file is the entry point of your application, it is where you define the domains you want to use.

As you can see, the server, logging, schema, everything is a domain. Don't want to use a database? Simple, remove

```typescript
[
  DatabaseDomain,
  {
    databases: {
      default: {
        engine: databaseEngine
      }
    }
  }
],
```

and you are good to go. The same goes for the server, logging, schema, etc. You build the application the way that you want to build.

Think about `Vite` for a minute. It doesn't do anything as well. It's a dev server, but it needs plugins in order to function. You attach the plugins and BAM, you have a full-fledged application. The same applies for Palmares. It's essentially a module system. You attach or remove the modules as you want/need.

###### About domains

A domain is as simple as that

```typescript
import { domain, mockInventory, mockUsers } from "shared";
import { testDomainModifier } from "@palmares/tests";

export default domain("core", __dirname, {
  modifiers: [testDomainModifier] as const,
  commands: {
    hello: {
      description: "Say hello world",
      keywordArgs: undefined,
      positionalArgs: undefined,
      handler: () => {
        console.log("Hello world");
      },
    },
  },
  getTests: () => [__dirname + "/core.test.ts"],
});
```

You can see that the domain is a function that returns an object. The object has a `commands` key, where you define the commands that you want to make it available on your application. Since `manage.ts` is the entrypoint, the `hello` command will be available for you when you run `tsx manage.ts hello`. It will print your command nicely on the console if you run `tsx manage.ts help`, this way you can see the arguments that the command accepts, the description, and everything related to that.

The `getTests` key exists because you defined the `testDomainModifier` on the `modifiers` key. This modifier will make the `getTests` key obligatory.

You can see that all domains on the app are different from each other. We are just using stuff that we need for each domain.

- **Database**:
  We are using drizzleORM as our adapter. As you can see we define the model as a Palmares model, but the adapter takes care of translating a Palmares model to the ORM model.

**Note**: Each model `options` might have an `instance` key, if you take this key out and run `pnpm run load`, it should reload models on `drizzle/schema.ts`. **The import @palmares/databases is defined on shared, so change it to `shared` on the `drizzle/schema.ts` file after reloading** (I don't recommend doing this often)

- **Server**:
  We are using express as our adapter. On `settings.ts` file you can see that we are using this

```typescript
ExpressServerAdapter.customServerSettings({
  middlewares: [cors()],
});
```

This lets you add express middlewares to the server. `ExpressServerAdapter.customServerSettings` also exposes let's you define additional behaviour of express with `additionalBehaviour` function like

```typescript
ExpressServerAdapter.customServerSettings({
  additionalBehaviour: (app) => {
    app.use(cors());
    return app;
  },
});
```

So you can still express routes and middlewares as you would do in a normal express application.

- **Schema**:
  We are using zod as our primary adapter. You can access the underlying zod schema by calling

```typescript
const schema = p.object({
  name: p.string().extends((schema) => {
    // schema is actually the underlying z.ZodString schema on this case. Now you can use any zod apis
    schema = schema.email();
    return schema;
  }),
});
```

- **Testing**:
  For testing we are using Jest as our primary adapter. You can access the underlying jest functions by calling

```typescript
import JestTestAdapter from "@palmares/jest-tests";

describe<JestTestAdapter>("Test", ({ custom: { jest } }) => {
  jest; // jest functions are available here
});

test<JestTestAdapter>("Test", ({ expect, custom: { jest } }) => {
  jest; // jest functions are available here
});
```

## Installation

To run this project, you need to have Node.js installed on your machine.

Then you need pnpm installed, you can install it by running:

```bash
npm install -g pnpm
```

After that, you can install the project dependencies by running:

```bash
pnpm install
```

## Running the Project

You can start the dev server by running:

```bash
pnpm run dev
```

## Database Stuff

Go to `models.ts` and comment out the `instance` key on the `Order` model.

Make the changes to your model and run:

```bash
pnpm run load
```

Go to `models.ts` and uncomment the `instance` key on the `Order` model.

Create a new migration by running:

```bash
pnpm run makemigrations
```

Migrate the database by running:

```bash
pnpm run migrate
```

