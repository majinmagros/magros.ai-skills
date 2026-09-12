# Workflows and Examples

## Finding Packages

1. Use `SearchPluginTool` with relevant keywords.
2. Apply filters for health, Laravel version, or PHP version.
3. Review names, descriptions, health indicators.

## Evaluating Packages

1. Use `GetPluginDetailsTool` with the package name.
2. Review health score, last updated, Laravel support.
3. Check vendor reputation and risk indicators.

## Checking Compatibility

1. Search with `laravel_compatibility` set to the project version, or
2. Get details on a specific package to see supported versions.

## Example: Find Authentication Packages

```
SearchPluginTool({
  text_search: "authentication",
  health_score: "Healthy"
})
```

Returns: spatie/laravel-permission, laravel/breeze, laravel/passport, etc.

## Example: Laravel 12 Compatible Packages

```
SearchPluginTool({
  text_search: "admin panel",
  laravel_compatibility: "12"
})
```

## Example: Get Package Details

```
GetPluginDetailsTool({
  package: "spatie/laravel-permission",
  include_versions: true
})
```

Returns health score, Laravel/PHP support, vendor reputation, version history, description.

## Example: Find Packages by Vendor

```
SearchPluginTool({
  vendor_filter: "spatie",
  health_score: "Healthy"
})
```
