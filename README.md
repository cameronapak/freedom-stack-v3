# Freedom Stack v3

A no-build stack built upon Web Standards that feels freeing and can be deployed anywhere.

## Uses

- [Bun](https://bun.sh) - Mostly used for the package manager, but we can use it for the runtime
- [Hono + Hono JSX](https://hono.dev) - Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.
- [Datastar](https://data-star.dev/) - Hypermedia backend and front-end framework (takes the best of HTMX and Alpine.js)
- [Basecoat](https://basecoatui.com/) - Shadcn UI-like component CSS library without the need for React
- [UnoCSS](https://unocss.dev/) - Runtime-build alternative to TailwindCSS
- [Bknd](https://bknd.io) - Comprehensive backend SDK with auth, db, and admin GUI

## How To

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

## Why a new version?

Let's take a stroll down memory lane. I built the first version of [Freedom Stack](https://github.com/cameronapak/freedom-stack) as a result of learning full-stack web dev and wanting to help others who were hungry to create have the tools to make their dream reality.

Freedom Stack v1 was built upon Astro, Astro DB, HTMX, Alpine.js, Better Auth, and DaisyUI + TailwindCSS.

I've used Freedom Stack v1 in many web apps, including using it as the base codebase for the homescreen of the [Wisephone II](https://wisephone.com/)! 

Over time, I learned a thing or two. And, AI coding had improved dramatically. I learned what made Freedom Stack great and I learned areas where it could improve, so... I did what any other person would do and created an entirely new version, Freedom Stack v2.

[Freedom Stack v2](https://github.com/cameronapak/freedom-stack-v2) was built upon Astro, Alpine.js + Alpine AJAX, TailwindCSS v4 + Basecoat UI, and Bknd. 

If you look closely, you'll see that v2 and v3 have a lot in common. To be honest, I built Freedom Stack v2 and only built one app with it, a skateboard deck designer tool. Even to this day, v2 has remained a work in progress. I _think_ v2 was created to help me better explore [Bknd](https://bknd.io/), the missing link: db, auth, storage, plugins, and workflows built into a single package. 

I am a HUGE fan and believer of [Bknd](https://bknd.io/) because it helps fulfil the desire I had early on with v1 of Freedom Stack: 

> "I wanted to provide a stack that's powerful like Ruby on Rails _("The One Person Framework")_, but with the ease and "vanilla" web dev feel of Astro."

So... why a v3? 

Bloat. Bloat is why there's a v3. 

For the past two years or so, I've loved working with [Val.Town](https://val.town). Think CodePen or CodeSandbox but it's instantly deployed and live, without having to worry about devops. With Val.Town I learned to love and embrace the Hono web framework and the no-build lifestyle.

But the straw that broke the camels back _(sorry poor camel)_ was that I found I was using Alpine.js in Astro and client-side bundling to do a lot of the logic on the client, oftentimes too much logic on the client. The codebase would often quickly bloat. Even towards the end of 2025, we converted an app constructed on the base of Freedom Stack to instead use React and Tanstack Router and be more of an SPA (single page application). _(aside: It's worth noting that Tanstack and Tanstack Start makes working with React a far, far greater experience.)_

Last nitpick... with Alpine and HTMX, because the two libraries are different, they require figuring out how to glue things together. So, when I learned about Datastar through [this conference talk by Delaney Gillian](https://www.youtube.com/watch?v=0K71AyAF6E4), it became the clear solution.

[The Tao of Datastar](https://data-star.dev/guide/the_tao_of_datastar) states that _"Most state should live in the backend. Since the frontend is exposed to the user, the backend should be the source of truth for your application state."_ Honestly... After years of skin in the game, I believe it. That idea is known as HATEOAS (Hypermedia as the Engine of Application State).

So, to ensure most of the state lives in the backend, in v3 I went with a no-build, no-bundle approach so that I was forced to abide by HATEOAS.

So, I chose a stack that would actually work with Val.Town, or really be deployable anywhere because it's built on Web Standards. 

Welcome to Freedom Stack v3!

— [Cameron Pak](https://cameronpak.com)
