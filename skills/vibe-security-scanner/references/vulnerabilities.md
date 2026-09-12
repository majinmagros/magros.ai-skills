# The 5 Vulnerabilities

These are the most common flaws in AI-generated SaaS code:

## 1. No Row Level Security (Supabase/Firebase)

```sql
-- FAIL: table wide open
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC
);
-- No RLS = any authenticated user reads ALL rows

-- PASS: RLS enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());
```

## 2. Frontend-Only Admin Check

```javascript
// FAIL: role stored in localStorage
const isAdmin = localStorage.getItem('role') === 'admin'
// Anyone can edit localStorage → full admin access

// PASS: server-side verification
const { data } = await supabase.rpc('is_admin', { uid: user.id })
if (!data) return res.status(403).json({ error: 'Forbidden' })
```

## 3. IDOR (Insecure Direct Object Reference)

```javascript
// FAIL: sequential ID, no ownership check
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.query(`SELECT * FROM invoices WHERE id = ${req.params.id}`)
  return res.json(invoice)  // user A reads user B's invoice
})

// PASS: ownership verified
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.query(
    `SELECT * FROM invoices WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user.id]
  )
  return res.json(invoice)
})
```

## 4. Hardcoded Secrets in Frontend

```javascript
// FAIL: API key in client bundle
const stripe = Stripe('sk_live_xxxxxxxxxxxxxxxx')

// PASS: secret only on server
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
```

## 5. XSS (Cross-Site Scripting)

```javascript
// FAIL: raw user input in DOM
element.innerHTML = userInput  // <script>steal_cookies()</script>

// PASS: sanitized
import DOMPurify from 'dompurify'
element.innerHTML = DOMPurify.sanitize(userInput)
// + Content-Security-Policy header
```
