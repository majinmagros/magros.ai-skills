# Query Patterns

## Upsert

Cross-engine-compatible form:

```sql
INSERT INTO user_settings (user_id, setting_key, setting_value)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    updated_at = CURRENT_TIMESTAMP;
```

MySQL row-alias form:

```sql
INSERT INTO user_settings (user_id, setting_key, setting_value)
VALUES (?, ?, ?) AS new
ON DUPLICATE KEY UPDATE
    setting_value = new.setting_value,
    updated_at = CURRENT_TIMESTAMP;
```

Use the row-alias form only after confirming the target is MySQL. Use
`VALUES(col)` for MariaDB or mixed MySQL/MariaDB fleets.

## Keyset Pagination

```sql
SELECT id, name, created_at
FROM products
WHERE (created_at, id) < (?, ?)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

Back it with an index that matches the cursor:

```sql
CREATE INDEX idx_products_created_id ON products (created_at, id);
```

Do not use deep `OFFSET` pagination on large tables; it makes the server scan
and discard rows before returning the page.

## JSON Fields

Use JSON columns for extension data, not for fields that need heavy relational
filtering or constraints.

```sql
CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payload JSON NOT NULL,
    event_type VARCHAR(64)
        GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(payload, '$.type'))) STORED,
    KEY idx_events_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

For frequently queried JSON paths, expose a generated column and index that
column. Keep foreign keys, ownership, tenancy, and lifecycle fields relational.

## Full-Text Search

```sql
ALTER TABLE articles ADD FULLTEXT KEY ft_articles_title_body (title, body);

SELECT id, title, MATCH(title, body) AGAINST (? IN NATURAL LANGUAGE MODE) AS score
FROM articles
WHERE MATCH(title, body) AGAINST (? IN NATURAL LANGUAGE MODE)
ORDER BY score DESC
LIMIT 20;
```

Use external search when you need typo tolerance, complex ranking, cross-table
facets, or language-specific analysis beyond built-in full-text behavior.
