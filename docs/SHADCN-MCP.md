# Shadcn MCP Server

Shadcn UI provides an MCP ("mini component playground") server to preview and experiment with components and design tokens while you build. The MCP server is a helpful complement to `shadcn:add` because it runs a live UI over a local component tree without having to spin up the full Next.js app.

## Next.js DevTools

If you prefer inspecting the component tree while running the full web app, Next.js ships with its own DevTools experience that can run alongside the MCP preview. Start the web dev server (`pnpm dev:web`) and then open the Next.js DevTools extension (or the browser-based Next DevTools when it is available) or visit `about:inspect` on the Next.js debugger tunnel to explore the component hierarchy, profiler, and server actions.

## Next.js App Router MCP

The App Router also exposes a built-in “MCP” (mini component playground) that documents how the router aligns with development tooling. Refer to the official guide before tweaking layout or page-loading behavior so you stay aligned with Next’s expectations: https://nextjs.org/docs/app/guides/mcp. Use it to validate server actions, streaming layouts, and client/server boundary contracts while keeping the shadcn MCP for UI preview.

Running both MCP and the Next.js dev server gives you the rapid component preview plus the full app instrumentation when you need to step through hooks, server actions, or layout/resolution logic.

## VS Code tips

- Use the Next.js DevTools extension in VS Code (search `Next.js` or open https://marketplace.visualstudio.com/items?itemName=stevencl.add-control) to get quick links into the DevTools panel while the server runs.  
- Launch `pnpm dev:web` inside the built-in terminal and use the Output/Terminal panel to monitor the server. The Next.js App Router MCP guide covers how to attach VS Code’s debugger once the server is live.  
- When editing shadcn components you can hit the MCP server via the browser, but keep VS Code’s integrated browser preview (Command+Shift+P → “Webview: Open Preview”) open if you want inline changes without switching apps.

## Running the server

1. `cd packages/ui-web`
2. Run `pnpm shadcn:mcp` — the script executes `pnpm dlx shadcn@latest mcp`, which starts the server and opens the browser automatically.
3. Follow the official guide if you need to configure custom components or themes: https://ui.shadcn.com/docs/mcp.

## Tips

- The MCP server reads the same `src/components` tree, so any component you add via `pnpm shadcn:add` appears in the MCP immediately after you refresh.
- Use `pnpm shadcn:mcp --help` for CLI options (preview mode, port, theme tokens, etc.).
