# Railbound CLI

Deploying a static site to the internet should take one command. Handing it off to a client should take one more.

Railbound is a deployment and handoff tool for developers who ship static websites to AWS. It deploys your site into your own AWS account through a fixed infrastructure path, so you always know exactly what's deployed and what state it's in, and makes transferring ownership to a client or successor operator an explicit step in the product, not something you sort out with documentation and goodwill after the fact.

The CLI is the primary way you interact with Railbound. Set it up once, and deploying is a single command from that point forward.

> **Railbound is currently in closed access.** Join the waitlist at [railbound.io](https://railbound.io).

---

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer

## Install

```bash
npm install -g railbound
```

## Commands

```bash
railbound help
```

Prints the current version, available commands, and links to documentation.

---

### Try it: `railbound deploy demo`

No AWS account or Railbound account required. `deploy demo` runs a real deployment against a Railbound-hosted demo environment and prints back the full deployment record — status, history, and a live URL.

```bash
railbound deploy demo
```

It's the same output you'll see on every real deployment. The infrastructure is already provisioned on our end, so it's fast. Your first real deployment will take longer because it provisions your infrastructure in your AWS account — but you only do that once.

To deploy your own sites, [join the waitlist](https://railbound.io).

---

## Links

- Site and waitlist: https://railbound.io
- Documentation: https://railbound.io/docs
- Source and issues: https://github.com/railbound-io/railbound