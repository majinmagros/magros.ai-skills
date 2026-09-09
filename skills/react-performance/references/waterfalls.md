# 1. Eliminating Waterfalls (CRITICAL)

> "Waterfalls are the #1 performance killer" — every sequential `await` adds full network latency.

### Cheap conditions before await

Check sync conditions (props, env, hardcoded flags) before awaiting remote data.

```ts
// INCORRECT
async function Page({ id }: { id: string }) {
  const flag = await getFlag("show-page");
  if (!flag || !id) return null;
  const data = await getData(id);
  // ...
}

// CORRECT — short-circuit on cheap sync condition first
async function Page({ id }: { id: string }) {
  if (!id) return null;
  const flag = await getFlag("show-page");
  if (!flag) return null;
  const data = await getData(id);
}
```

### Defer awaits until used

Move `await` into the branch that uses it.

```ts
// INCORRECT — awaits before deciding it needs the data
const user = await getUser(id);
if (mode === "guest") return renderGuest();
return renderUser(user);

// CORRECT
if (mode === "guest") return renderGuest();
const user = await getUser(id);
return renderUser(user);
```

### Promise.all for independent work

```ts
// INCORRECT — sequential
const user = await getUser(id);
const posts = await getPosts(id);
const followers = await getFollowers(id);

// CORRECT — parallel
const [user, posts, followers] = await Promise.all([
  getUser(id),
  getPosts(id),
  getFollowers(id),
]);
```

### Partial dependencies — start early, await late

```ts
// CORRECT — kick off all promises, await only when each result is needed
const userP = getUser(id);
const postsP = getPosts(id);
const profile = await getProfile(id);
if (profile.private) return null;
const [user, posts] = await Promise.all([userP, postsP]);
```

### Suspense for streaming

Push `<Suspense>` boundaries close to the data so the page paints what it can while slower sub-trees stream in. The trade-off: layout shift when content arrives — reserve space (skeleton or `min-height`).

### Server Components: parallel through composition

```tsx
// INCORRECT — sibling awaits run sequentially inside one component
export default async function Page() {
  const user = await getUser();
  const cart = await getCart();
  return <View user={user} cart={cart} />;
}

// CORRECT — split into children, React runs them in parallel
export default async function Page() {
  return (
    <View>
      <UserSection />
      <CartSection />
    </View>
  );
}
```
