# nhentai API v2 路由整理

- 文件來源：https://nhentai.net/api/v2/docs#/
- 規格來源：https://nhentai.net/api/v2/openapi.json
- 生成時間：2026-05-14T15:01:05.327Z
- OpenAPI 版本：3.1.0
- API 標題：nhentai API
- API 版本：2.0.0+0e1f38a

## 驗證方式

| 名稱 | 型別 | Header | 說明 |
| --- | --- | --- | --- |
| User Token | apiKey | Authorization | User access token: \`User <token>\` |
| API Key | apiKey | Authorization | API key: \`Key <api_key>\` |

## 路由總覽

| Tag | 路由數 | 說明 |
| --- | ---: | --- |
| default | 4 | - |
| cdn | 1 | Gallery and thumbnail \`path\` values are relative. Fetch available servers from \`GET /api/v2/cdn\` and concatenate one with the \`path\` to form a full URL. **Don't hardcode specific subdomains;** the list can change.<br><br>**Use the \`path\` exactly as returned.** Don't construct paths by guessing extensions, suffixes, or numbering. The CDN strictly validates URL patterns and silently rejects anything that doesn't match a known media route. Clients that do this repeatedly will eventually receive an **extended ban**.<br><br>Rate limits are generous for normal browsing. Brief bursts (like loading a full gallery's thumbnails at once) are absorbed without \`429\`s. Clients that sustain rates well beyond typical browsing, or repeatedly request invalid URL patterns, will be **temporarily banned**. Bans are short and self-expiring. **Treat \`429\` as a backoff signal.**<br><br>**Note: full-gallery archives have a dedicated endpoint at \`POST /api/v2/galleries/{id}/download\`. Don't reconstruct them by walking page URLs on the CDN.** |
| galleries | 11 | Browse, search, and retrieve gallery data. |
| tags | 4 | Tag lookup, listing, and search. |
| GTS | 9 | Gallery tag suggestions. Users propose adding/removing a tag on a gallery and vote on others' suggestions; staff accept or reject. |
| taxonomy | 13 | Community proposals against the global tag taxonomy: create, rename, merge, or describe. Resolved entries are a public ledger with the staff resolution_note attached. |
| search | 1 | Full-text gallery search with filters. |
| comments | 5 | Gallery comments. |
| users | 1 | Public user profiles. |
| favorites | 2 | Favorite gallery management. |
| blacklist | 3 | Tag blacklist management. |
| zones | 4 | - |
| user | 7 | **First-party and internal only**, bar \`GET /api/v2/user\`. These endpoints are documented for API completeness and should NOT be used by third-party clients. They are intended only for nhentai's own services and will be enforced. Third-party applications should authenticate using API keys via \`Authorization: Key YOUR_API_KEY\`. |
| auth | 9 | **First-party and internal only.** These endpoints are documented for API completeness and should NOT be used by third-party clients. They are intended only for nhentai's own services and will be enforced. Third-party applications should authenticate using API keys via \`Authorization: Key YOUR_API_KEY\`. |
| moderation | 27 | Staff-only moderation tools. |

## Tag: default

### GET /api/v2

- Operation ID：api_root_api_v2_get
- 作用：Api Root
- 官方摘要：Api Root
- 官方描述：API root.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ApiRootResponse { version*: string, message*: string } | Successful Response |

### GET /api/v2/captcha

- Operation ID：get_captcha_info_api_v2_captcha_get
- 作用：Get Captcha Info
- 官方摘要：Get Captcha Info
- 官方描述：Get CAPTCHA provider info for the frontend widget.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | CaptchaInfoResponse { provider*: string, site_key*: string } | Successful Response |

### GET /api/v2/config

- Operation ID：get_config_api_v2_config_get
- 作用：Get Config
- 官方摘要：Get Config
- 官方描述：Get app config: CDN servers and current announcement.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ConfigResponse { image_servers*: array<string>, thumb_servers*: array<string>, announcement: anyOf<ref:Announcement \| null> } | Successful Response |

### GET /api/v2/pow

- Operation ID：get_pow_challenge_api_v2_pow_get
- 作用：Get Pow Challenge
- 官方摘要：Get Pow Challenge
- 官方描述：Get a new proof of work challenge. Optionally specify action for per-action difficulty.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| action | query | false | anyOf<string \| null> | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PoWChallengeResponse { challenge*: string, difficulty*: integer } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

## Tag: cdn

Gallery and thumbnail \`path\` values are relative. Fetch available servers from \`GET /api/v2/cdn\` and concatenate one with the \`path\` to form a full URL. **Don't hardcode specific subdomains;** the list can change.<br><br>**Use the \`path\` exactly as returned.** Don't construct paths by guessing extensions, suffixes, or numbering. The CDN strictly validates URL patterns and silently rejects anything that doesn't match a known media route. Clients that do this repeatedly will eventually receive an **extended ban**.<br><br>Rate limits are generous for normal browsing. Brief bursts (like loading a full gallery's thumbnails at once) are absorbed without \`429\`s. Clients that sustain rates well beyond typical browsing, or repeatedly request invalid URL patterns, will be **temporarily banned**. Bans are short and self-expiring. **Treat \`429\` as a backoff signal.**<br><br>**Note: full-gallery archives have a dedicated endpoint at \`POST /api/v2/galleries/{id}/download\`. Don't reconstruct them by walking page URLs on the CDN.**

### GET /api/v2/cdn

- Operation ID：get_cdn_config_api_v2_cdn_get
- 作用：Get Cdn Config
- 官方摘要：Get Cdn Config
- 官方描述：Get CDN server configuration for media URLs.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | CdnConfigResponse { image_servers*: array<string>, thumb_servers*: array<string> } | Successful Response |

## Tag: galleries

Browse, search, and retrieve gallery data.

### GET /api/v2/galleries

- Operation ID：get_all_galleries_api_v2_galleries_get
- 作用：Get All Galleries
- 官方摘要：Get All Galleries
- 官方描述：Get paginated galleries ordered by newest first.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 15/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PaginatedResponse_GalleryListItem_ { result*: array<ref:GalleryListItem>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/galleries/{gallery_id}

- Operation ID：get_gallery_api_v2_galleries__gallery_id__get
- 作用：Get Gallery
- 官方摘要：Get Gallery
- 官方描述：Get a single gallery with full details and optional includes.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 20/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 45/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |
| include | query | false | string | - | Comma-separated: comments,related,favorite,suggestions |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | GalleryDetailResponse { id*: integer, media_id*: string, title*: ref:GalleryTitle, cover*: ref:CoverInfo, thumbnail*: ref:CoverInfo, scanlator: string, upload_date*: integer, tags*: array<ref:TagResponse>, num_pages*: integer, num_favorites*: integer, ... } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/galleries/{gallery_id}/download

- Operation ID：issue_download_url_api_v2_galleries__gallery_id__download_post
- 作用：Get a download URL for a gallery
- 官方摘要：Get a download URL for a gallery
- 官方描述：Returns a short-lived URL for the gallery as a zip, cbz, or torrent<br>file. Fetch \`url\` before \`expires_at\` (unix timestamp).<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Feature Flag:** \`allow_downloads\` must be enabled<br><br>**Rate limits:**<br><br>When \`format=torrent\`:<br>  - 5/1min per IP<br>  - 10/5min per user<br>  - 5/1min per API key owner<br><br>When \`format=zip\|cbz (default)\`:<br>  - 10/5min per IP<br>  - 7/5min per user<br>  - 10/5min per API key owner
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |
| format | query | false | string[zip, cbz, torrent] | default=zip; enum=zip,cbz,torrent | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | DownloadResponse { url*: string, expires_at*: integer } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/galleries/{gallery_id}/edit

- Operation ID：submit_gallery_edit_api_v2_galleries__gallery_id__edit_post
- 作用：Submit Gallery Edit
- 官方摘要：Submit Gallery Edit
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | SubmitEditRequest { created_tags: array<ref:CreatedTag>, added_tags: array<integer>, removed_tags: array<integer> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SubmitEditResponse { success*: boolean, edit_id*: integer, auto_applied*: boolean } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### DELETE /api/v2/galleries/{gallery_id}/favorite

- Operation ID：remove_from_favorites_api_v2_galleries__gallery_id__favorite_delete
- 作用：Remove From Favorites
- 官方摘要：Remove From Favorites
- 官方描述：Remove a gallery from the current user's favorites.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Feature Flag:** \`allow_favorites\` must be enabled<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner<br>- 15/1min per IP + user<br>- 15/1min per IP + API key owner
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | FavoriteResponse { favorited*: boolean, num_favorites: anyOf<integer \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/galleries/{gallery_id}/favorite

- Operation ID：check_favorite_api_v2_galleries__gallery_id__favorite_get
- 作用：Check Favorite
- 官方摘要：Check Favorite
- 官方描述：Check if a gallery is in the user's favorites.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | FavoriteResponse { favorited*: boolean, num_favorites: anyOf<integer \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/galleries/{gallery_id}/favorite

- Operation ID：add_to_favorites_api_v2_galleries__gallery_id__favorite_post
- 作用：Add To Favorites
- 官方摘要：Add To Favorites
- 官方描述：Add a gallery to the current user's favorites.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Feature Flag:** \`allow_favorites\` must be enabled<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner<br>- 15/1min per IP + user<br>- 15/1min per IP + API key owner
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | FavoriteResponse { favorited*: boolean, num_favorites: anyOf<integer \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/galleries/{gallery_id}/related

- Operation ID：get_related_galleries_api_v2_galleries__gallery_id__related_get
- 作用：Get Related Galleries
- 官方摘要：Get Related Galleries
- 官方描述：Get galleries similar to the specified gallery.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 12/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | RelatedGalleriesResponse { result*: array<ref:GalleryListItem> } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/galleries/popular

- Operation ID：get_popular_galleries_api_v2_galleries_popular_get
- 作用：Get Popular Galleries
- 官方摘要：Get Popular Galleries
- 官方描述：Get today's popular galleries.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br>- 8/1min per IP
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:GalleryListItem> | Successful Response |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/galleries/random

- Operation ID：get_random_gallery_api_v2_galleries_random_get
- 作用：Get Random Gallery
- 官方摘要：Get Random Gallery
- 官方描述：Get a random gallery ID.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 20/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/galleries/tagged

- Operation ID：get_galleries_by_tag_api_v2_galleries_tagged_get
- 作用：Get Galleries By Tag
- 官方摘要：Get Galleries By Tag
- 官方描述：Get galleries with a specific tag.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 15/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| tag_id | query | true | integer | - | Tag ID to filter by |
| sort | query | false | string[date, popular, popular-today, popular-week, popular-month] | default=date; enum=date,popular,popular-today,popular-week,popular-month | - |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PaginatedResponse_GalleryListItem_ { result*: array<ref:GalleryListItem>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null> } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: tags

Tag lookup, listing, and search.

### GET /api/v2/tags/{tag_type}

- Operation ID：get_tags_by_type_api_v2_tags__tag_type__get
- 作用：Get Tags By Type
- 官方摘要：Get Tags By Type
- 官方描述：Get tags of a specific type with pagination.<br><br>Supports both page-based and cursor-based pagination.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 15/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| tag_type | path | true | string | - | - |
| sort | query | false | string[name, popular] | default=popular; enum=name,popular | - |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TagPaginatedResponse { result*: array<ref:TagResponse>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null>, alphabet: anyOf<object<key,string;value,anyOf<array<integer> \| null>> \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/tags/{tag_type}/{slug}

- Operation ID：get_tag_by_slug_api_v2_tags__tag_type___slug__get
- 作用：Get Tag By Slug
- 官方摘要：Get Tag By Slug
- 官方描述：Get a specific tag by type and slug.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 15/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 30/1min per IP
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| tag_type | path | true | string | - | - |
| slug | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TagResponse { id*: integer, type*: string, name*: string, slug*: string, url*: string, count*: integer, description: anyOf<string \| null>, is_community: anyOf<boolean \| null> } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/tags/ids

- Operation ID：get_tags_by_ids_api_v2_tags_ids_get
- 作用：Get Tags By Ids
- 官方摘要：Get Tags By Ids
- 官方描述：Look up multiple tags by ID. Max 100 per request.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br>- 15/1min per IP
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| ids | query | true | string | - | Comma-separated tag IDs |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:TagResponse> | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/tags/search

- Operation ID：search_tags_api_v2_tags_search_post
- 作用：Search Tags
- 官方摘要：Search Tags
- 官方描述：Search tags by name prefix. Omit \`type\` to search across all tag types.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br>- 30/1min per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | AutocompleteRequest { type: anyOf<string \| null>, query: anyOf<string \| null>, limit: integer } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:TagResponse> | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: GTS

Gallery tag suggestions. Users propose adding/removing a tag on a gallery and vote on others' suggestions; staff accept or reject.

### GET /api/v2/galleries/{gallery_id}/suggestions

- Operation ID：list_gallery_suggestions_api_v2_galleries__gallery_id__suggestions_get
- 作用：List Gallery Suggestions
- 官方摘要：List Gallery Suggestions
- 官方描述：List current tag-change proposals on a gallery.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Feature Flag:** \`allow_gts\` must be enabled<br><br>**Rate limits:**<br>- 60/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |
| tier | query | false | string | pattern=^(all\|trending\|active\|declined\|hidden\|mine\|history)$; default=all | - |
| limit | query | false | integer | min=1; max=100; default=20 | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuggestionListResponse { result*: array<ref:SuggestionResponse>, has_more: anyOf<boolean \| null>, num_pages: anyOf<integer \| null>, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/galleries/{gallery_id}/suggestions

- Operation ID：create_suggestion_api_v2_galleries__gallery_id__suggestions_post
- 作用：Create Suggestion
- 官方摘要：Create Suggestion
- 官方描述：Propose adding or removing a tag on a gallery.<br><br>If a matching proposal already exists, your call adds your vote to it<br>instead of creating a duplicate.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_gts\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=gts_create\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 10/1h per user<br>- 30/1h per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_create_suggestion_api_v2_galleries__gallery_id__suggestions_post { tag_id*: integer, action: string[add, remove], captcha_response: anyOf<string \| null>, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuggestionResponse { id*: string, gallery_id*: integer, tag*: ref:SuggestionTag, action*: string[add, remove], status*: string[pending, accepted, rejected, superseded], score: anyOf<integer \| null>, voter_count*: integer, proposer*: ref:SuggestionProposer, created_at*: string, resolved_at: anyOf<string \| null>, ... } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | CaptchaErrorResponse { error*: string, captcha_required: boolean, captcha_public_key*: string } | Forbidden |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too Many Requests |
| 503 | application/json | ErrorResponse { error*: string } | Service Unavailable |

### DELETE /api/v2/galleries/{gallery_id}/suggestions/{suggestion_id}

- Operation ID：withdraw_suggestion_api_v2_galleries__gallery_id__suggestions__suggestion_id__delete
- 作用：Withdraw Suggestion
- 官方摘要：Withdraw Suggestion
- 官方描述：Proposer withdraws their own pending suggestion.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_gts\` must be enabled<br><br>**Rate limits:**<br>- 20/1h per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |
| suggestion_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/galleries/{gallery_id}/suggestions/{suggestion_id}/vote

- Operation ID：vote_on_suggestion_api_v2_galleries__gallery_id__suggestions__suggestion_id__vote_post
- 作用：Vote On Suggestion
- 官方摘要：Vote On Suggestion
- 官方描述：Up/down vote on a suggestion. Pass vote=0 to clear your vote.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_gts\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=gts_vote\`)<br><br>**Rate limits:**<br>- 80/1h per user<br>- 240/1h per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_vote_on_suggestion_api_v2_galleries__gallery_id__suggestions__suggestion_id__vote_post { vote*: integer, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuggestionResponse { id*: string, gallery_id*: integer, tag*: ref:SuggestionTag, action*: string[add, remove], status*: string[pending, accepted, rejected, superseded], score: anyOf<integer \| null>, voter_count*: integer, proposer*: ref:SuggestionProposer, created_at*: string, resolved_at: anyOf<string \| null>, ... } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Service Unavailable |

### GET /api/v2/moderation/gts

- Operation ID：list_pending_suggestions_api_v2_moderation_gts_get
- 作用：List Pending Suggestions
- 官方摘要：List Pending Suggestions
- 官方描述：Mod queue: proposals awaiting staff review, or recently resolved.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 60/5min per user<br>- 120/5min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| status | query | false | string | pattern=^(pending\|accepted\|rejected)$; default=pending | - |
| q | query | false | anyOf<string \| null> | - | - |
| sort | query | false | string | pattern=^(score\|voters\|newest\|oldest)$; default=score | - |
| tag_type | query | false | anyOf<string \| null> | - | - |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuggestionListResponse { result*: array<ref:SuggestionResponse>, has_more: anyOf<boolean \| null>, num_pages: anyOf<integer \| null>, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/gts/{suggestion_id}/accept

- Operation ID：accept_suggestion_api_v2_moderation_gts__suggestion_id__accept_post
- 作用：Accept Suggestion
- 官方摘要：Accept Suggestion
- 官方描述：Apply a pending suggestion to the gallery and mark accepted.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | ResolveSuggestionRequest { note: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/gts/{suggestion_id}/reject

- Operation ID：reject_suggestion_api_v2_moderation_gts__suggestion_id__reject_post
- 作用：Reject Suggestion
- 官方摘要：Reject Suggestion
- 官方描述：Reject a pending suggestion without applying it.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | ResolveSuggestionRequest { note: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/gts/{suggestion_id}/revert

- Operation ID：revert_suggestion_api_v2_moderation_gts__suggestion_id__revert_post
- 作用：Revert Suggestion
- 官方摘要：Revert Suggestion
- 官方描述：Undo the tag mutation of a previously accepted suggestion.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/tags

- Operation ID：moderation_create_tag_api_v2_moderation_tags_post
- 作用：Moderation Create Tag
- 官方摘要：Moderation Create Tag
- 官方描述：Create a new tag. Slug is derived from \`name\`.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | CreateTagRequest { type*: string[tag, artist, parody, character, group, language, category], name*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | CreatedTagResponse { id*: integer, type*: string, name*: string, slug*: string, url*: string } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

## Tag: taxonomy

Community proposals against the global tag taxonomy: create, rename, merge, or describe. Resolved entries are a public ledger with the staff resolution_note attached.

### DELETE /api/v2/moderation/taxonomy/{suggestion_id}

- Operation ID：delete_taxonomy_suggestion_api_v2_moderation_taxonomy__suggestion_id__delete
- 作用：Delete Taxonomy Suggestion
- 官方摘要：Delete Taxonomy Suggestion
- 官方描述：Permanently remove a tag suggestion. Reserved for spam and abuse.<br><br>---<br><br>**Auth:** Superuser Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/moderation/taxonomy/{suggestion_id}/accept

- Operation ID：accept_taxonomy_suggestion_api_v2_moderation_taxonomy__suggestion_id__accept_post
- 作用：Accept Taxonomy Suggestion
- 官方摘要：Accept Taxonomy Suggestion
- 官方描述：Accept a tag suggestion.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | ResolveTaxonomySuggestionRequest { note: anyOf<string \| null>, name_override: anyOf<string \| null>, description_override: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/taxonomy/{suggestion_id}/reject

- Operation ID：reject_taxonomy_suggestion_api_v2_moderation_taxonomy__suggestion_id__reject_post
- 作用：Reject Taxonomy Suggestion
- 官方摘要：Reject Taxonomy Suggestion
- 官方描述：Reject a tag suggestion.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | ResolveTaxonomySuggestionRequest { note: anyOf<string \| null>, name_override: anyOf<string \| null>, description_override: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/taxonomy

- Operation ID：list_taxonomy_suggestions_api_v2_taxonomy_get
- 作用：List Taxonomy Suggestions
- 官方摘要：List Taxonomy Suggestions
- 官方描述：List pending tag suggestions.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 120/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| tier | query | false | string | pattern=^(all\|trending\|active\|declined\|mine)$; default=all | - |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=200; default=50 | - |
| q | query | false | anyOf<string \| null> | - | - |
| target_tag_id | query | false | anyOf<integer \| null> | - | - |
| has_comments | query | false | anyOf<boolean \| null> | - | - |
| actions | query | false | anyOf<string \| null> | - | Comma-separated subset of create,rename,merge,describe. Defaults to all. |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionListResponse { result*: array<ref:TaxonomySuggestionResponse>, has_more: anyOf<boolean \| null>, num_pages: anyOf<integer \| null>, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/taxonomy

- Operation ID：create_taxonomy_suggestion_api_v2_taxonomy_post
- 作用：Create Taxonomy Suggestion
- 官方摘要：Create Taxonomy Suggestion
- 官方描述：Submit a tag suggestion.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=taxonomy_create\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 4/4h per user<br>- 12/4h per IP
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_create_taxonomy_suggestion_api_v2_taxonomy_post { action*: string[create, rename, merge, describe], target_tag_id: anyOf<integer \| null>, merge_into_tag_id: anyOf<integer \| null>, new_name: anyOf<string \| null>, new_type: anyOf<string[tag, artist, parody, character, group, language, category] \| null>, description: anyOf<string \| null>, proposer_note: anyOf<string \| null>, captcha_response: anyOf<string \| null>, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionResponse { id*: string, action*: string[create, rename, merge, describe], status*: string[pending, accepted, rejected, withdrawn], score*: integer, voter_count*: integer, proposer*: ref:TaxonomySuggestionProposer, proposer_note: anyOf<string \| null>, created_at*: string, resolved_at: anyOf<string \| null>, resolution_note: anyOf<string \| null>, ... } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | CaptchaErrorResponse { error*: string, captcha_required: boolean, captcha_public_key*: string } | Forbidden |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too Many Requests |
| 503 | application/json | ErrorResponse { error*: string } | Service Unavailable |

### DELETE /api/v2/taxonomy/{suggestion_id}

- Operation ID：withdraw_taxonomy_suggestion_api_v2_taxonomy__suggestion_id__delete
- 作用：Withdraw Taxonomy Suggestion
- 官方摘要：Withdraw Taxonomy Suggestion
- 官方描述：Withdraw your pending tag suggestion.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 10/1h per user<br>- 20/1h per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/taxonomy/{suggestion_id}

- Operation ID：get_taxonomy_suggestion_api_v2_taxonomy__suggestion_id__get
- 作用：Get Taxonomy Suggestion
- 官方摘要：Get Taxonomy Suggestion
- 官方描述：Fetch a tag suggestion with its latest comment preview.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 120/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionResponse { id*: string, action*: string[create, rename, merge, describe], status*: string[pending, accepted, rejected, withdrawn], score*: integer, voter_count*: integer, proposer*: ref:TaxonomySuggestionProposer, proposer_note: anyOf<string \| null>, created_at*: string, resolved_at: anyOf<string \| null>, resolution_note: anyOf<string \| null>, ... } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/taxonomy/{suggestion_id}/comments

- Operation ID：list_taxonomy_comments_api_v2_taxonomy__suggestion_id__comments_get
- 作用：List Taxonomy Comments
- 官方摘要：List Taxonomy Comments
- 官方描述：List comments on a tag suggestion.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 120/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=100; default=50 | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomyCommentListResponse { result*: array<ref:TaxonomyCommentResponse>, has_more: anyOf<boolean \| null>, num_pages: anyOf<integer \| null>, total: anyOf<integer \| null> } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/taxonomy/{suggestion_id}/comments

- Operation ID：create_taxonomy_comment_api_v2_taxonomy__suggestion_id__comments_post
- 作用：Create Taxonomy Comment
- 官方摘要：Create Taxonomy Comment
- 官方描述：Post a comment on a tag suggestion.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=comment\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 5/15min per user<br>- 5/15min per IP + user<br>- 10/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_create_taxonomy_comment_api_v2_taxonomy__suggestion_id__comments_post { body*: string, captcha_response: anyOf<string \| null>, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomyCommentResponse { id*: string, body*: string, author*: ref:TaxonomyCommentAuthor, created_at*: string, can_delete: boolean } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | CaptchaErrorResponse { error*: string, captcha_required: boolean, captcha_public_key*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Service Unavailable |

### DELETE /api/v2/taxonomy/{suggestion_id}/comments/{comment_id}

- Operation ID：delete_taxonomy_comment_api_v2_taxonomy__suggestion_id__comments__comment_id__delete
- 作用：Delete Taxonomy Comment
- 官方摘要：Delete Taxonomy Comment
- 官方描述：Delete a comment. Authors can delete their own; moderators can delete any.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 30/15min per user<br>- 60/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |
| comment_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/taxonomy/{suggestion_id}/vote

- Operation ID：vote_on_taxonomy_suggestion_api_v2_taxonomy__suggestion_id__vote_post
- 作用：Vote On Taxonomy Suggestion
- 官方摘要：Vote On Taxonomy Suggestion
- 官方描述：Vote on a tag suggestion. Pass vote=0 to clear.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=taxonomy_vote\`)<br><br>**Rate limits:**<br>- 30/1h per user<br>- 60/1h per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| suggestion_id | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_vote_on_taxonomy_suggestion_api_v2_taxonomy__suggestion_id__vote_post { vote*: integer, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionResponse { id*: string, action*: string[create, rename, merge, describe], status*: string[pending, accepted, rejected, withdrawn], score*: integer, voter_count*: integer, proposer*: ref:TaxonomySuggestionProposer, proposer_note: anyOf<string \| null>, created_at*: string, resolved_at: anyOf<string \| null>, resolution_note: anyOf<string \| null>, ... } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Service Unavailable |

### GET /api/v2/taxonomy/resolved

- Operation ID：list_resolved_taxonomy_suggestions_api_v2_taxonomy_resolved_get
- 作用：List Resolved Taxonomy Suggestions
- 官方摘要：List Resolved Taxonomy Suggestions
- 官方描述：List resolved tag suggestions.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 90/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| status | query | false | string | pattern=^(all\|accepted\|rejected)$; default=all | - |
| has_comments | query | false | anyOf<boolean \| null> | - | - |
| actions | query | false | anyOf<string \| null> | - | Comma-separated subset of create,rename,merge,describe. |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionListResponse { result*: array<ref:TaxonomySuggestionResponse>, has_more: anyOf<boolean \| null>, num_pages: anyOf<integer \| null>, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/taxonomy/stats

- Operation ID：get_taxonomy_suggestion_stats_api_v2_taxonomy_stats_get
- 作用：Get Taxonomy Suggestion Stats
- 官方摘要：Get Taxonomy Suggestion Stats
- 官方描述：Taxonomy activity summary: pending count + recently-accepted suggestions.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Feature Flag:** \`allow_taxonomy\` must be enabled<br><br>**Rate limits:**<br>- 30/1min per IP
- 驗證：Public

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TaxonomySuggestionStats { pending*: integer, accepted_total*: integer, rejected_total*: integer, accepted_30d*: integer, accepted_7d*: integer, created_30d*: integer, renamed_30d*: integer, merged_30d*: integer, described_30d*: integer, trending_count: integer, ... } | Successful Response |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

## Tag: search

Full-text gallery search with filters.

### GET /api/v2/search

- Operation ID：search_galleries_api_v2_search_get
- 作用：Search Galleries
- 官方摘要：Search Galleries
- 官方描述：Search galleries.<br><br>Supports:<br>- Keywords: \`word\`<br>- Exact phrases: \`"exact phrase"\`<br>- Negation: \`-word\`, \`-"exact phrase"\`, \`-artist:name\`<br>- Tag filters: \`artist:name\`, \`language:english\`, \`tag:"big breasts"\`<br>- Numeric filters: \`pages:>10\`, \`favorites:>=100\`<br>- Date filters: \`uploaded:<7d\`, \`uploaded:>1m\`<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 10/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 20/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| query | query | true | string | minLen=1 | Search query |
| sort | query | false | string[date, popular, popular-today, popular-week, popular-month] | default=date; enum=date,popular,popular-today,popular-week,popular-month | Sort order |
| page | query | false | integer | min=1; default=1 | Page number |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PaginatedResponse_GalleryListItem_ { result*: array<ref:GalleryListItem>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: comments

Gallery comments.

### DELETE /api/v2/comments/{comment_id}

- Operation ID：delete_comment_api_v2_comments__comment_id__delete
- 作用：Delete Comment
- 官方摘要：Delete Comment
- 官方描述：Delete a comment.<br><br>Only the comment owner or staff can delete comments.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_comments\` must be enabled<br><br>**Rate limits:**<br>- 5/15min per user<br>- 5/15min per IP + user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| comment_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/comments/{comment_id}/flag

- Operation ID：flag_comment_api_v2_comments__comment_id__flag_post
- 作用：Flag Comment
- 官方摘要：Flag Comment
- 官方描述：Flag a comment for review.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 10/15min per user<br>- 10/15min per IP + user<br>- 15/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| comment_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | FlagCommentRequest { reason*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/galleries/{gallery_id}/comments

- Operation ID：get_gallery_comments_api_v2_galleries__gallery_id__comments_get
- 作用：Get Gallery Comments
- 官方摘要：Get Gallery Comments
- 官方描述：Get all comments for a gallery.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 6/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 15/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:CommentResponse> | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/galleries/{gallery_id}/comments

- Operation ID：create_comment_api_v2_galleries__gallery_id__comments_post
- 作用：Create Comment
- 官方摘要：Create Comment
- 官方描述：Create a new comment on a gallery.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_comments\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=comment\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 5/15min per user<br>- 5/15min per IP + user<br>- 10/15min per IP
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_create_comment_api_v2_galleries__gallery_id__comments_post { body*: string, captcha_response: anyOf<string \| null>, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | CommentResponse { id*: integer, gallery_id*: integer, poster*: ref:UserPublic, post_date*: integer, body*: string } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 403 | application/json | CaptchaErrorResponse { error*: string, captcha_required: boolean, captcha_public_key*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/galleries/{gallery_id}/comments/count

- Operation ID：get_gallery_comment_count_api_v2_galleries__gallery_id__comments_count_get
- 作用：Get Gallery Comment Count
- 官方摘要：Get Gallery Comment Count
- 官方描述：Get the visible comment count for a gallery.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 12/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 20/1min per IP
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | integer | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: users

Public user profiles.

### GET /api/v2/users/{user_id}/{slug}

- Operation ID：get_user_profile_api_v2_users__user_id___slug__get
- 作用：Get User Profile
- 官方摘要：Get User Profile
- 官方描述：Get a user's public profile.<br><br>Requires both the user ID and correct username slug.<br><br>---<br><br>**Auth:** Public (optional User Token or API Key for personalization)<br><br>**Rate limits:**<br><br>When \`auth=anon\`:<br>  - 5/1min per IP<br><br>When \`auth=user\|key\`:<br>  - 10/1min per IP
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user_id | path | true | integer | - | - |
| slug | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | UserProfileResponse { id*: integer, username*: string, slug*: string, avatar_url*: string, is_superuser: boolean, is_staff: boolean, date_joined*: integer, about: string, favorite_tags: string, recent_favorites*: array<ref:RecentFavorite>, ... } | Successful Response |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: favorites

Favorite gallery management.

### GET /api/v2/favorites

- Operation ID：get_favorites_api_v2_favorites_get
- 作用：Get Favorites
- 官方摘要：Get Favorites
- 官方描述：Get the authenticated user's favorite galleries.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner
- 驗證：API Key, User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| q | query | false | anyOf<string \| null> | - | Search within favorites |
| page | query | false | integer | min=1; default=1 | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PaginatedResponse_GalleryListItem_ { result*: array<ref:GalleryListItem>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/favorites/random

- Operation ID：get_random_favorite_api_v2_favorites_random_get
- 作用：Get Random Favorite
- 官方摘要：Get Random Favorite
- 官方描述：Get a random gallery ID from the authenticated user's favorites.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: blacklist

Tag blacklist management.

### GET /api/v2/blacklist

- Operation ID：get_blacklist_api_v2_blacklist_get
- 作用：Get Blacklist
- 官方摘要：Get Blacklist
- 官方描述：Get the authenticated user's blacklisted tags.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 15/1min per user<br>- 15/1min per API key owner
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | BlacklistListResponse { tags*: array<ref:BlacklistedTagResponse>, count*: integer } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/blacklist

- Operation ID：update_blacklist_api_v2_blacklist_post
- 作用：Update Blacklist
- 官方摘要：Update Blacklist
- 官方描述：Add or remove tags from the authenticated user's blacklist.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 20/15min per user<br>- 20/15min per API key owner
- 驗證：API Key, User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | BlacklistUpdateRequest { added: array<integer>, removed: array<integer> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | BlacklistResponse { success*: boolean, count*: integer } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/blacklist/ids

- Operation ID：get_blacklist_ids_api_v2_blacklist_ids_get
- 作用：Get Blacklist Ids
- 官方摘要：Get Blacklist Ids
- 官方描述：Get just the tag IDs for the authenticated user's blacklist.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 45/1min per user
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<integer> | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: zones

### GET /api/v2/zones

- Operation ID：get_zones_api_v2_zones_get
- 作用：Get Zones
- 官方摘要：Get Zones
- 官方描述：Get ad HTML for all zones.<br><br>Returns:<br>    Dict mapping zone spec to HTML for all active zones.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user-agent | header | false | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,string> | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### POST /api/v2/zones/h

- Operation ID：record_popunder_hit_api_v2_zones_h_post
- 作用：Record Popunder Hit
- 官方摘要：Record Popunder Hit
- 官方描述：Record a popunder impression/open event.<br><br>Called by frontend when a popunder is triggered.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user-agent | header | false | string | - | - |
| tor_session | cookie | false | anyOf<string \| null> | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | RecordPopunderRequest { name*: string, type: string, record: boolean } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | RecordPopunderResponse { success: boolean } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/zones/i

- Operation ID：get_popunder_inventory_api_v2_zones_i_get
- 作用：Get Popunder Inventory
- 官方摘要：Get Popunder Inventory
- 官方描述：Get available popunder for current user.<br><br>Returns the next popunder to show with timing info.<br>delta is in milliseconds (0 means ready to show).<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user-agent | header | false | string | - | - |
| cf-ipcountry | header | false | string | - | - |
| tor_session | cookie | false | anyOf<string \| null> | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PopunderInventoryResponse { name: anyOf<string \| null>, delta: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/zones/pu

- Operation ID：popunder_redirect_api_v2_zones_pu_get
- 作用：Popunder Redirect
- 官方摘要：Popunder Redirect
- 官方描述：Redirect to popunder ad URL.<br><br>Two-step process:<br>1. First call (without out=1): records "opens" stat, redirects to self with out=1<br>2. Second call (with out=1): records "redirects" stat, redirects to actual URL<br><br>This allows tracking of both opens and actual redirects.<br><br>---<br><br>**Auth:** Public (no authentication required)
- 驗證：Public

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| name | query | true | string | - | - |
| out | query | false | anyOf<string \| null> | - | - |
| user-agent | header | false | string | - | - |
| tor_session | cookie | false | anyOf<string \| null> | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | unknown | Close window on error |
| 200 | text/html | - | Close window on error |
| 302 | - | - | Redirect to popunder URL |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

## Tag: user

**First-party and internal only**, bar \`GET /api/v2/user\`. These endpoints are documented for API completeness and should NOT be used by third-party clients. They are intended only for nhentai's own services and will be enforced. Third-party applications should authenticate using API keys via \`Authorization: Key YOUR_API_KEY\`.

### DELETE /api/v2/user

- Operation ID：delete_account_api_v2_user_delete
- 作用：Delete Account
- 官方摘要：Delete Account
- 官方描述：Delete your account. Requires password and username confirmation.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 3/1h per user<br>- 3/1h per IP + user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | DeleteProfileRequest { password*: string, confirmation*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | DeleteProfileResponse { success*: boolean, message*: string } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/user

- Operation ID：get_me_api_v2_user_get
- 作用：Get Me
- 官方摘要：Get Me
- 官方描述：Get your profile info. Email is hidden for API key auth.<br><br>---<br><br>**Auth:** User Token or API Key<br><br>**Rate limits:**<br>- 45/1min per user<br>- 45/1min per API key owner
- 驗證：API Key, User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | UserMeResponse { id*: integer, username*: string, slug*: string, avatar_url*: string, theme: string, is_staff: boolean, is_superuser: boolean, about: string, favorite_tags: string, email: anyOf<string \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### PUT /api/v2/user

- Operation ID：update_profile_api_v2_user_put
- 作用：Update Profile
- 官方摘要：Update Profile
- 官方描述：Update your profile.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 30/15min per user<br>- 30/15min per IP + user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | UpdateProfileRequest { username: anyOf<string \| null>, email: anyOf<string \| null>, about: anyOf<string \| null>, favorite_tags: anyOf<string \| null>, theme: anyOf<string \| null>, current_password: anyOf<string \| null>, new_password: anyOf<string \| null>, default_avatar: anyOf<string[default, classic] \| null> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | UpdateProfileResponse { success*: boolean, username*: string, email: anyOf<string \| null>, avatar_url*: string, about: string, favorite_tags: string, theme: string } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/user/avatar

- Operation ID：upload_avatar_api_v2_user_avatar_post
- 作用：Upload Avatar
- 官方摘要：Upload Avatar
- 官方描述：Upload a new avatar image.<br><br>Accepts JPEG, PNG, GIF, or WebP up to 10 MB. The image is converted to<br>PNG and resized to fit within 200x200 pixels. Returns the new avatar URL.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 5/1min per user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| multipart/form-data | true | Body_upload_avatar_api_v2_user_avatar_post { avatar*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 413 | application/json | ErrorResponse { error*: string } | Request Entity Too Large |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 502 | application/json | ErrorResponse { error*: string } | Bad Gateway |

### GET /api/v2/user/keys

- Operation ID：list_api_keys_api_v2_user_keys_get
- 作用：List Api Keys
- 官方摘要：List Api Keys
- 官方描述：List your API keys.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 30/1min per user
- 驗證：User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:ApiKeyListItem> | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/user/keys

- Operation ID：create_api_key_api_v2_user_keys_post
- 作用：Create Api Key
- 官方摘要：Create Api Key
- 官方描述：Create a new API key. The raw key is only shown once.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_api_keys\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=api_key\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 5/1h per user<br>- 5/1h per IP + user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_create_api_key_api_v2_user_keys_post { name*: string, purpose: string, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null>, captcha_response*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ApiKeyCreateResponse { id*: string, key*: string, name*: string } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### DELETE /api/v2/user/keys/{key_id}

- Operation ID：revoke_api_key_api_v2_user_keys__key_id__delete
- 作用：Revoke Api Key
- 官方摘要：Revoke Api Key
- 官方描述：Revoke an API key.<br><br>---<br><br>**Auth:** User Token required<br><br>**Feature Flag:** \`allow_api_keys\` must be enabled<br><br>**Rate limits:**<br>- 10/1h per user<br>- 10/1h per IP + user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| key_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

## Tag: auth

**First-party and internal only.** These endpoints are documented for API completeness and should NOT be used by third-party clients. They are intended only for nhentai's own services and will be enforced. Third-party applications should authenticate using API keys via \`Authorization: Key YOUR_API_KEY\`.

### POST /api/v2/auth/login

- Operation ID：login_api_v2_auth_login_post
- 作用：Login
- 官方摘要：Login
- 官方描述：Authenticate with username/email and password.<br><br>Returns access token and refresh token.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=login\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 10/15min per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_login_api_v2_auth_login_post { username*: string, password*: string, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null>, captcha_response*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TokenResponse { access_token*: string, refresh_token*: string, user*: ref:UserInfo } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/auth/logout

- Operation ID：logout_api_v2_auth_logout_post
- 作用：Logout
- 官方摘要：Logout
- 官方描述：Revoke the refresh token.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 10/15min per user<br>- 10/15min per IP + user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_logout_api_v2_auth_logout_post { refresh_token*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/auth/logout/all

- Operation ID：logout_all_api_v2_auth_logout_all_post
- 作用：Logout All
- 官方摘要：Logout All
- 官方描述：Revoke all sessions for the current user (log out everywhere).<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 5/1h per user<br>- 5/1h per IP + user
- 驗證：User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/auth/refresh

- Operation ID：refresh_api_v2_auth_refresh_post
- 作用：Refresh
- 官方摘要：Refresh
- 官方描述：Exchange a refresh token for new access + refresh tokens.<br><br>The old refresh token is revoked (token rotation).<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Rate limits:**<br>- 15/15min per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_refresh_api_v2_auth_refresh_post { refresh_token*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | RefreshResponse { access_token*: string, refresh_token*: string, user*: ref:UserInfo } | Successful Response |
| 401 | application/json | ErrorResponse { error*: string } | Unauthorized |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/auth/register

- Operation ID：register_api_v2_auth_register_post
- 作用：Register
- 官方摘要：Register
- 官方描述：Create a new account.<br><br>Returns access token and refresh token.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Feature Flag:** \`allow_register\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=register\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 3/1h per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_register_api_v2_auth_register_post { username*: string, email*: string, password*: string, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null>, captcha_response*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | TokenResponse { access_token*: string, refresh_token*: string, user*: ref:UserInfo } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 409 | application/json | ErrorResponse { error*: string } | Conflict |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/auth/reset

- Operation ID：request_password_reset_api_v2_auth_reset_post
- 作用：Request Password Reset
- 官方摘要：Request Password Reset
- 官方描述：Request a password reset.<br><br>Sends a reset link to the user's email if the account exists.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Feature Flag:** \`allow_password_reset\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=reset\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 3/15min per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_request_password_reset_api_v2_auth_reset_post { username_or_email*: string, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null>, captcha_response*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### POST /api/v2/auth/reset/confirm

- Operation ID：confirm_password_reset_api_v2_auth_reset_confirm_post
- 作用：Confirm Password Reset
- 官方摘要：Confirm Password Reset
- 官方描述：Confirm a password reset with the token from the reset email.<br><br>---<br><br>**Auth:** Public (no authentication required)<br><br>**Feature Flag:** \`allow_password_reset\` must be enabled<br><br>**Protection:** Proof of Work required (\`GET /api/v2/pow?action=reset\`)<br><br>**Protection:** CAPTCHA required (\`GET /api/v2/captcha\` for provider info)<br><br>**Rate limits:**<br>- 5/15min per IP
- 驗證：Public

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_confirm_password_reset_api_v2_auth_reset_confirm_post { token*: string, password*: string, pow_challenge: anyOf<string \| null>, pow_nonce: anyOf<string \| null>, captcha_response*: string } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |
| 503 | application/json | ErrorResponse { error*: string } | Feature is currently disabled |

### GET /api/v2/auth/sessions

- Operation ID：get_sessions_api_v2_auth_sessions_get
- 作用：Get Sessions
- 官方摘要：Get Sessions
- 官方描述：List all active sessions for the current user.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 30/1min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| x-refresh-token | header | false | anyOf<string \| null> | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | array<ref:SessionListItem> | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### DELETE /api/v2/auth/sessions/{session_id}

- Operation ID：revoke_session_api_v2_auth_sessions__session_id__delete
- 作用：Revoke Session
- 官方摘要：Revoke Session
- 官方描述：Revoke a specific session by ID.<br><br>---<br><br>**Auth:** User Token required<br><br>**Rate limits:**<br>- 10/1min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| session_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Tag: moderation

Staff-only moderation tools.

### POST /api/v2/comments/flags/{flag_id}/review

- Operation ID：review_comment_flag_api_v2_comments_flags__flag_id__review_post
- 作用：Review Comment Flag
- 官方摘要：Review Comment Flag
- 官方描述：Review a comment flag.<br><br>Actions:<br>- approve: Accept the flag and hide the comment<br>- reject: Reject the flag, no action taken<br><br>Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| flag_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | ReviewFlagRequest { action*: string[approve, reject] } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ReviewFlagResponse { success*: boolean, is_user_shadowbanned: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/moderation/api-keys

- Operation ID：list_all_api_keys_api_v2_moderation_api_keys_get
- 作用：List All Api Keys
- 官方摘要：List All Api Keys
- 官方描述：List all active API keys with user info. Admin only.<br><br>---<br><br>**Auth:** Superuser Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=200; default=50 | - |
| sort | query | false | string[created, last_used] | default=created; enum=created,last_used | - |
| has_purpose | query | false | anyOf<boolean \| null> | - | True = only with purpose set; False = only without |
| q | query | false | string | maxLen=200 | Substring match on name or purpose |
| key_id | query | false | anyOf<string \| null> | - | Exact key id; returns 0 or 1 result |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationApiKeysListResponse { keys*: array<ref:ModerationApiKeyItem>, total*: integer, page*: integer, per_page*: integer, num_pages*: integer } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### DELETE /api/v2/moderation/api-keys/{key_id}

- Operation ID：revoke_api_key_admin_api_v2_moderation_api_keys__key_id__delete
- 作用：Revoke Api Key Admin
- 官方摘要：Revoke Api Key Admin
- 官方描述：Revoke any API key. Admin only.<br><br>---<br><br>**Auth:** Superuser Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| key_id | path | true | string | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### POST /api/v2/moderation/bulk/hide

- Operation ID：bulk_hide_api_v2_moderation_bulk_hide_post
- 作用：Bulk Hide
- 官方摘要：Bulk Hide
- 官方描述：Hide multiple comments. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | array<integer> | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/bulk/shadowban

- Operation ID：bulk_shadowban_api_v2_moderation_bulk_shadowban_post
- 作用：Bulk Shadowban
- 官方摘要：Bulk Shadowban
- 官方描述：Shadowban multiple users. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | array<integer> | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/bulk/unhide

- Operation ID：bulk_unhide_api_v2_moderation_bulk_unhide_post
- 作用：Bulk Unhide
- 官方摘要：Bulk Unhide
- 官方描述：Unhide multiple comments. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | array<integer> | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/bulk/unshadowban

- Operation ID：bulk_unshadowban_api_v2_moderation_bulk_unshadowban_post
- 作用：Bulk Unshadowban
- 官方摘要：Bulk Unshadowban
- 官方描述：Unshadowban multiple users. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | array<integer> | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### DELETE /api/v2/moderation/comments/{comment_id}/hide

- Operation ID：unhide_comment_api_v2_moderation_comments__comment_id__hide_delete
- 作用：Unhide Comment
- 官方摘要：Unhide Comment
- 官方描述：Unhide a comment. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| comment_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### PUT /api/v2/moderation/comments/{comment_id}/hide

- Operation ID：hide_comment_api_v2_moderation_comments__comment_id__hide_put
- 作用：Hide Comment
- 官方摘要：Hide Comment
- 官方描述：Hide a comment. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| comment_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/moderation/comments/recent

- Operation ID：get_recent_comments_api_v2_moderation_comments_recent_get
- 作用：Get Recent Comments
- 官方摘要：Get Recent Comments
- 官方描述：Get recent visible comments. Admin only.<br><br>---<br><br>**Auth:** Superuser Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=500; default=100 | - |
| q | query | false | anyOf<string \| null> | - | Search by username or comment body |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationCommentsListResponse { comments*: array<ref:ModerationCommentResponse>, total*: integer, page*: integer, per_page*: integer, num_pages*: integer } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/moderation/comments/spam

- Operation ID：get_spam_comments_api_v2_moderation_comments_spam_get
- 作用：Get Spam Comments
- 官方摘要：Get Spam Comments
- 官方描述：Get spam/hidden comments. Admin only.<br><br>---<br><br>**Auth:** Superuser Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=500; default=100 | - |
| q | query | false | anyOf<string \| null> | - | Search by username or comment body |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationCommentsListResponse { comments*: array<ref:ModerationCommentResponse>, total*: integer, page*: integer, per_page*: integer, num_pages*: integer } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/moderation/edits

- Operation ID：get_pending_edits_api_v2_moderation_edits_get
- 作用：Get Pending Edits
- 官方摘要：Get Pending Edits
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| limit | query | false | integer | min=1; max=200; default=50 | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | EditListResponse { edits*: array<ref:EditResponse>, count*: integer } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/moderation/edits/{edit_id}

- Operation ID：get_edit_api_v2_moderation_edits__edit_id__get
- 作用：Get Edit
- 官方摘要：Get Edit
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| edit_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | EditResponse { id*: integer, user_id*: anyOf<integer \| null>, user_username*: anyOf<string \| null>, gallery_id*: integer, gallery_title*: anyOf<string \| null>, date*: integer, accepted*: anyOf<boolean \| null>, added_tags*: array<ref:EditTagInfo>, removed_tags*: array<ref:EditTagInfo>, created_tags*: array<ref:CreatedTag>, ... } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### POST /api/v2/moderation/edits/{edit_id}/apply

- Operation ID：apply_edit_api_v2_moderation_edits__edit_id__apply_post
- 作用：Apply Edit
- 官方摘要：Apply Edit
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| edit_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/edits/{edit_id}/reject

- Operation ID：reject_edit_api_v2_moderation_edits__edit_id__reject_post
- 作用：Reject Edit
- 官方摘要：Reject Edit
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| edit_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### POST /api/v2/moderation/edits/{edit_id}/vote

- Operation ID：vote_on_edit_api_v2_moderation_edits__edit_id__vote_post
- 作用：Vote On Edit
- 官方摘要：Vote On Edit
- 官方描述：Retired. Tag changes go through the suggestion flow now.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| edit_id | path | true | integer | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | VoteRequest { accept*: boolean } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | VoteResponse { success*: boolean, upvotes*: integer, downvotes*: integer } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/moderation/flags

- Operation ID：get_pending_flags_api_v2_moderation_flags_get
- 作用：Get Pending Flags
- 官方摘要：Get Pending Flags
- 官方描述：Get pending (unreviewed) comment flags. Staff only.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | - |
| per_page | query | false | integer | min=1; max=200; default=50 | - |
| q | query | false | anyOf<string \| null> | - | Search by username or comment body |
| hide_shadowbanned | query | false | boolean | default=true | Exclude flags on shadowbanned users' comments |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationFlagsListResponse { flags*: array<ref:ModerationFlagItem>, total*: integer, page*: integer, per_page*: integer, num_pages*: integer } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/moderation/galleries/{gallery_id}

- Operation ID：get_gallery_mod_info_api_v2_moderation_galleries__gallery_id__get
- 作用：Get Gallery Mod Info
- 官方摘要：Get Gallery Mod Info
- 官方描述：Get moderation status for a gallery.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationGalleryInfo { id*: integer, hidden*: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### DELETE /api/v2/moderation/galleries/{gallery_id}/hidden

- Operation ID：unhide_gallery_api_v2_moderation_galleries__gallery_id__hidden_delete
- 作用：Unhide Gallery
- 官方摘要：Unhide Gallery
- 官方描述：Reveal a previously-hidden gallery. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | HiddenGalleryResponse { id*: integer, hidden*: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### PUT /api/v2/moderation/galleries/{gallery_id}/hidden

- Operation ID：hide_gallery_api_v2_moderation_galleries__gallery_id__hidden_put
- 作用：Hide Gallery
- 官方摘要：Hide Gallery
- 官方描述：Hide a gallery from public reads. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| gallery_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | HiddenGalleryResponse { id*: integer, hidden*: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/moderation/galleries/hidden

- Operation ID：list_hidden_galleries_api_v2_moderation_galleries_hidden_get
- 作用：List Hidden Galleries
- 官方摘要：List Hidden Galleries
- 官方描述：List hidden galleries newest-first.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| page | query | false | integer | min=1; default=1 | Page number |
| per_page | query | false | integer | min=1; max=100; default=25 | Items per page |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | PaginatedResponse_GalleryListItem_ { result*: array<ref:GalleryListItem>, num_pages*: integer, per_page: integer, total: anyOf<integer \| null> } | Successful Response |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### GET /api/v2/moderation/spam/config

- Operation ID：get_spam_config_api_v2_moderation_spam_config_get
- 作用：Get Spam Config
- 官方摘要：Get Spam Config
- 官方描述：Staff only.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |

### PUT /api/v2/moderation/spam/config/{name}

- Operation ID：update_spam_config_api_v2_moderation_spam_config__name__put
- 作用：Update Spam Config
- 官方摘要：Update Spam Config
- 官方描述：Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| name | path | true | string | - | - |

**Request Body (Payload)**

| Content-Type | 必填 | Schema | 說明 |
| --- | --- | --- | --- |
| application/json | true | Body_update_spam_config_api_v2_moderation_spam_config__name__put { items*: array<string> } | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | SuccessResponse { success: boolean, message: anyOf<string \| null> } | Successful Response |
| 400 | application/json | ErrorResponse { error*: string } | Bad Request |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### DELETE /api/v2/moderation/users/{user_id}

- Operation ID：delete_user_api_v2_moderation_users__user_id__delete
- 作用：Delete User
- 官方摘要：Delete User
- 官方描述：Delete a user account. Cascades user-owned content. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 10/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | object<key,string;value,unknown> | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### GET /api/v2/moderation/users/{user_id}

- Operation ID：get_user_mod_info_api_v2_moderation_users__user_id__get
- 作用：Get User Mod Info
- 官方摘要：Get User Mod Info
- 官方描述：Get moderation info for a user. Staff sees shadowban, admins also see email.<br><br>---<br><br>**Auth:** Staff Token required
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ModerationUserInfo { id*: integer, is_shadowbanned*: boolean, email: anyOf<string \| null> } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |

### DELETE /api/v2/moderation/users/{user_id}/shadowban

- Operation ID：unshadowban_user_api_v2_moderation_users__user_id__shadowban_delete
- 作用：Unshadowban User
- 官方摘要：Unshadowban User
- 官方描述：Remove shadowban from a user. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ShadowbanResponse { shadowbanned*: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

### PUT /api/v2/moderation/users/{user_id}/shadowban

- Operation ID：shadowban_user_api_v2_moderation_users__user_id__shadowban_put
- 作用：Shadowban User
- 官方摘要：Shadowban User
- 官方描述：Shadowban a user. Staff only.<br><br>---<br><br>**Auth:** Staff Token required<br><br>**Rate limits:**<br>- 30/15min per user
- 驗證：User Token

**參數**

| 名稱 | 位置 | 必填 | 型別 | 限制/預設 | 說明 |
| --- | --- | --- | --- | --- | --- |
| user_id | path | true | integer | - | - |

**Responses**

| HTTP 狀態 | Content-Type | Schema | 說明 |
| --- | --- | --- | --- |
| 200 | application/json | ShadowbanResponse { shadowbanned*: boolean } | Successful Response |
| 403 | application/json | ErrorResponse { error*: string } | Forbidden |
| 404 | application/json | ErrorResponse { error*: string } | Not Found |
| 422 | application/json | HTTPValidationError { detail: array<ref:ValidationError> } | Validation Error |
| 429 | application/json | ErrorResponse { error*: string } | Too many requests |

## Schema 速查

`*` 代表 required 欄位。以下列出第一層欄位，方便快速對照 payload/response。

### ApiKeyCreateResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| key* | string | - |
| name* | string | - |

### ApiKeyListItem

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| key_prefix* | string | - |
| name* | string | - |
| created_at* | integer | - |
| last_used_at | anyOf<integer \| null> | - |

### ApiRootResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| version* | string | - |
| message* | string | - |

### AutocompleteRequest

Autocomplete request body.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| type | anyOf<string \| null> | - |
| query | anyOf<string \| null> | - |
| limit | integer | - |

### BlacklistListResponse

Response for listing blacklisted tags.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| tags* | array<ref:BlacklistedTagResponse> | - |
| count* | integer | - |

### BlacklistResponse

Response for blacklist operations.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| count* | integer | - |

### BlacklistUpdateRequest

Request body for updating blacklist.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| added | array<integer> | - |
| removed | array<integer> | - |

### Body_confirm_password_reset_api_v2_auth_reset_confirm_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| token* | string | Reset token from the email link |
| password* | string | New password |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |
| captcha_response* | string | CAPTCHA response token from the widget |

### Body_create_api_key_api_v2_user_keys_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| name* | string | - |
| purpose | string | - |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |
| captcha_response* | string | CAPTCHA response token from the widget |

### Body_create_comment_api_v2_galleries__gallery_id__comments_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| body* | string | Comment text |
| captcha_response | anyOf<string \| null> | CAPTCHA response token |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### Body_create_suggestion_api_v2_galleries__gallery_id__suggestions_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| tag_id* | integer | - |
| action | string[add, remove] | - |
| captcha_response | anyOf<string \| null> | CAPTCHA response token |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### Body_create_taxonomy_comment_api_v2_taxonomy__suggestion_id__comments_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| body* | string | - |
| captcha_response | anyOf<string \| null> | CAPTCHA response token |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### Body_create_taxonomy_suggestion_api_v2_taxonomy_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| action* | string[create, rename, merge, describe] | - |
| target_tag_id | anyOf<integer \| null> | - |
| merge_into_tag_id | anyOf<integer \| null> | - |
| new_name | anyOf<string \| null> | - |
| new_type | anyOf<string[tag, artist, parody, character, group, language, category] \| null> | - |
| description | anyOf<string \| null> | - |
| proposer_note | anyOf<string \| null> | - |
| captcha_response | anyOf<string \| null> | CAPTCHA response token |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### Body_login_api_v2_auth_login_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| username* | string | Username or email |
| password* | string | - |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |
| captcha_response* | string | CAPTCHA response token from the widget |

### Body_logout_api_v2_auth_logout_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| refresh_token* | string | Refresh token to revoke |

### Body_refresh_api_v2_auth_refresh_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| refresh_token* | string | Refresh token to exchange |

### Body_register_api_v2_auth_register_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| username* | string | - |
| email* | string | - |
| password* | string | - |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |
| captcha_response* | string | CAPTCHA response token from the widget |

### Body_request_password_reset_api_v2_auth_reset_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| username_or_email* | string | Username or email address |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |
| captcha_response* | string | CAPTCHA response token from the widget |

### Body_update_spam_config_api_v2_moderation_spam_config__name__put

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| items* | array<string> | - |

### Body_upload_avatar_api_v2_user_avatar_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| avatar* | string | - |

### Body_vote_on_suggestion_api_v2_galleries__gallery_id__suggestions__suggestion_id__vote_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| vote* | integer | - |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### Body_vote_on_taxonomy_suggestion_api_v2_taxonomy__suggestion_id__vote_post

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| vote* | integer | - |
| pow_challenge | anyOf<string \| null> | PoW challenge from GET /api/v2/pow (required when difficulty > 0) |
| pow_nonce | anyOf<string \| null> | Nonce that solves the PoW challenge (required when difficulty > 0) |

### CaptchaErrorResponse

Error response when CAPTCHA verification fails.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| error* | string | - |
| captcha_required | boolean | - |
| captcha_public_key* | string | - |

### CaptchaInfoResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| provider* | string | - |
| site_key* | string | - |

### CdnConfigResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| image_servers* | array<string> | - |
| thumb_servers* | array<string> | - |

### CommentResponse

Comment response matching Django format.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| gallery_id* | integer | - |
| poster* | ref:UserPublic | - |
| post_date* | integer | - |
| body* | string | - |

### ConfigResponse

Combined config: CDN servers + announcement.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| image_servers* | array<string> | - |
| thumb_servers* | array<string> | - |
| announcement | anyOf<ref:Announcement \| null> | - |

### CreateTagRequest

Mod-only request to mint a brand-new tag.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| type* | string[tag, artist, parody, character, group, language, category] | - |
| name* | string | - |

### CreatedTagResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| type* | string | - |
| name* | string | - |
| slug* | string | - |
| url* | string | - |

### DeleteProfileRequest

Request body for deleting user profile.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| password* | string | - |
| confirmation* | string | - |

### DeleteProfileResponse

Response for profile deletion.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| message* | string | - |

### DownloadResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| url* | string | - |
| expires_at* | integer | - |

### EditListResponse

Response for listing edits.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| edits* | array<ref:EditResponse> | - |
| count* | integer | - |

### EditResponse

Single edit response.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| user_id* | anyOf<integer \| null> | - |
| user_username* | anyOf<string \| null> | - |
| gallery_id* | integer | - |
| gallery_title* | anyOf<string \| null> | - |
| date* | integer | - |
| accepted* | anyOf<boolean \| null> | - |
| added_tags* | array<ref:EditTagInfo> | - |
| removed_tags* | array<ref:EditTagInfo> | - |
| created_tags* | array<ref:CreatedTag> | - |
| upvotes | integer | - |
| downvotes | integer | - |
| user_vote | anyOf<boolean \| null> | - |

### ErrorResponse

Error response.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| error* | string | - |

### FavoriteResponse

Response for favorite/unfavorite actions.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| favorited* | boolean | - |
| num_favorites | anyOf<integer \| null> | - |

### FlagCommentRequest

Request body for flagging a comment.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| reason* | string | - |

### GalleryDetailResponse

Gallery detail with optional included data (comments, related, favorite, suggestions).

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| media_id* | string | - |
| title* | ref:GalleryTitle | - |
| cover* | ref:CoverInfo | - |
| thumbnail* | ref:CoverInfo | - |
| scanlator | string | - |
| upload_date* | integer | - |
| tags* | array<ref:TagResponse> | - |
| num_pages* | integer | - |
| num_favorites* | integer | - |
| pages | array<ref:PageInfo> | - |
| comments | anyOf<array<ref:CommentResponse> \| null> | - |
| related | anyOf<array<ref:GalleryListItem> \| null> | - |
| is_favorited | anyOf<boolean \| null> | - |
| suggestions | anyOf<ref:GallerySuggestionsBundle \| null> | - |

### GalleryListItem

Lightweight gallery for list views.<br>Used in search results, tag listings, homepage.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| media_id* | string | - |
| english_title* | string | - |
| japanese_title | anyOf<string \| null> | - |
| thumbnail* | string | - |
| thumbnail_width* | integer | - |
| thumbnail_height* | integer | - |
| num_pages | integer | - |
| tag_ids | array<integer> | - |
| blacklisted | boolean | - |

### HTTPValidationError

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| detail | array<ref:ValidationError> | - |

### HiddenGalleryResponse

Response for gallery hide/unhide actions.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| hidden* | boolean | - |

### ModerationApiKeysListResponse

Paginated list of API keys for admin.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| keys* | array<ref:ModerationApiKeyItem> | - |
| total* | integer | - |
| page* | integer | - |
| per_page* | integer | - |
| num_pages* | integer | - |

### ModerationCommentsListResponse

Response for moderation comment lists.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| comments* | array<ref:ModerationCommentResponse> | - |
| total* | integer | - |
| page* | integer | - |
| per_page* | integer | - |
| num_pages* | integer | - |

### ModerationFlagsListResponse

Paginated list of pending flags.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| flags* | array<ref:ModerationFlagItem> | - |
| total* | integer | - |
| page* | integer | - |
| per_page* | integer | - |
| num_pages* | integer | - |

### ModerationGalleryInfo

Moderation status for a gallery.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| hidden* | boolean | - |

### ModerationUserInfo

Moderation details for a user. \`email\` is present only for admins.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| is_shadowbanned* | boolean | - |
| email | anyOf<string \| null> | - |

### PaginatedResponse_GalleryListItem_

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:GalleryListItem> | - |
| num_pages* | integer | - |
| per_page | integer | - |
| total | anyOf<integer \| null> | - |

### PoWChallengeResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| challenge* | string | - |
| difficulty* | integer | - |

### PopunderInventoryResponse

Response for popunder inventory request.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| name | anyOf<string \| null> | - |
| delta | anyOf<integer \| null> | - |

### RecordPopunderRequest

Request to record a popunder event.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| name* | string | - |
| type | string | - |
| record | boolean | - |

### RecordPopunderResponse

Response for record popunder request.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success | boolean | - |

### RefreshResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| access_token* | string | - |
| refresh_token* | string | - |
| user* | ref:UserInfo | - |

### RelatedGalleriesResponse

Response for related galleries endpoint.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:GalleryListItem> | - |

### ResolveSuggestionRequest

Body for moderation accept/reject.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| note | anyOf<string \| null> | - |

### ResolveTaxonomySuggestionRequest

Body for moderation accept/reject.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| note | anyOf<string \| null> | - |
| name_override | anyOf<string \| null> | - |
| description_override | anyOf<string \| null> | - |

### ReviewFlagRequest

Request body for reviewing a comment flag.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| action* | string[approve, reject] | - |

### ReviewFlagResponse

Response for flag review actions.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| is_user_shadowbanned | boolean | - |

### SessionListItem

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| created_at* | integer | - |
| expires_at* | integer | - |
| ip_address | anyOf<string \| null> | - |
| user_agent | anyOf<string \| null> | - |
| current | boolean | - |

### ShadowbanResponse

Response for shadowban actions.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| shadowbanned* | boolean | - |

### SubmitEditRequest

Request body for submitting a gallery edit.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| created_tags | array<ref:CreatedTag> | - |
| added_tags | array<integer> | - |
| removed_tags | array<integer> | - |

### SubmitEditResponse

Response for edit submission.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| edit_id* | integer | - |
| auto_applied* | boolean | - |

### SuccessResponse

Simple success response.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success | boolean | - |
| message | anyOf<string \| null> | - |

### SuggestionListResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:SuggestionResponse> | - |
| has_more | anyOf<boolean \| null> | - |
| num_pages | anyOf<integer \| null> | - |
| total | anyOf<integer \| null> | - |

### SuggestionResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| gallery_id* | integer | - |
| tag* | ref:SuggestionTag | - |
| action* | string[add, remove] | - |
| status* | string[pending, accepted, rejected, superseded] | - |
| score | anyOf<integer \| null> | - |
| voter_count* | integer | - |
| proposer* | ref:SuggestionProposer | - |
| created_at* | string | - |
| resolved_at | anyOf<string \| null> | - |
| resolver | anyOf<ref:SuggestionProposer \| null> | - |
| resolution_note | anyOf<string \| null> | - |
| reverted_at | anyOf<string \| null> | - |
| reverter | anyOf<ref:SuggestionProposer \| null> | - |
| my_vote | anyOf<integer \| null> | - |
| tier | anyOf<string[trending, active, declined, hidden] \| null> | - |

### TagPaginatedResponse

Paginated tag response with optional alphabet mapping.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:TagResponse> | - |
| num_pages* | integer | - |
| per_page | integer | - |
| total | anyOf<integer \| null> | - |
| alphabet | anyOf<object<key,string;value,anyOf<array<integer> \| null>> \| null> | - |

### TagResponse

Tag response matching Django format.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| type* | string | - |
| name* | string | - |
| slug* | string | - |
| url* | string | - |
| count* | integer | - |
| description | anyOf<string \| null> | - |
| is_community | anyOf<boolean \| null> | - |

### TaxonomyCommentListResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:TaxonomyCommentResponse> | - |
| has_more | anyOf<boolean \| null> | - |
| num_pages | anyOf<integer \| null> | - |
| total | anyOf<integer \| null> | - |

### TaxonomyCommentResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| body* | string | - |
| author* | ref:TaxonomyCommentAuthor | - |
| created_at* | string | - |
| can_delete | boolean | - |

### TaxonomySuggestionListResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| result* | array<ref:TaxonomySuggestionResponse> | - |
| has_more | anyOf<boolean \| null> | - |
| num_pages | anyOf<integer \| null> | - |
| total | anyOf<integer \| null> | - |

### TaxonomySuggestionResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | string | - |
| action* | string[create, rename, merge, describe] | - |
| status* | string[pending, accepted, rejected, withdrawn] | - |
| score* | integer | - |
| voter_count* | integer | - |
| proposer* | ref:TaxonomySuggestionProposer | - |
| proposer_note | anyOf<string \| null> | - |
| created_at* | string | - |
| resolved_at | anyOf<string \| null> | - |
| resolution_note | anyOf<string \| null> | - |
| resolver | anyOf<ref:TaxonomySuggestionResolver \| null> | - |
| target_tag | anyOf<ref:TaxonomySuggestionTag \| null> | - |
| merge_into_tag | anyOf<ref:TaxonomySuggestionTag \| null> | - |
| new_name | anyOf<string \| null> | - |
| new_type | anyOf<string \| null> | - |
| description | anyOf<string \| null> | - |
| resolved_tag | anyOf<ref:TaxonomySuggestionTag \| null> | - |
| my_vote | anyOf<integer \| null> | - |
| tier | anyOf<string[trending, active, declined, hidden, mine] \| null> | - |
| tier_page | anyOf<integer \| null> | - |
| comment_count | integer | - |
| recent_comments | array<ref:TaxonomyCommentResponse> | - |

### TaxonomySuggestionStats

Taxonomy activity summary: pending count + recently-accepted suggestions.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| pending* | integer | - |
| accepted_total* | integer | - |
| rejected_total* | integer | - |
| accepted_30d* | integer | - |
| accepted_7d* | integer | - |
| created_30d* | integer | - |
| renamed_30d* | integer | - |
| merged_30d* | integer | - |
| described_30d* | integer | - |
| trending_count | integer | - |
| active_count | integer | - |
| declined_count | integer | - |
| recent_accepted* | array<ref:TaxonomySuggestionResponse> | - |

### TokenResponse

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| access_token* | string | - |
| refresh_token* | string | - |
| user* | ref:UserInfo | - |

### UpdateProfileRequest

Request body for updating user profile.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| username | anyOf<string \| null> | - |
| email | anyOf<string \| null> | - |
| about | anyOf<string \| null> | - |
| favorite_tags | anyOf<string \| null> | - |
| theme | anyOf<string \| null> | - |
| current_password | anyOf<string \| null> | - |
| new_password | anyOf<string \| null> | - |
| default_avatar | anyOf<string[default, classic] \| null> | - |

### UpdateProfileResponse

Response for profile update.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| username* | string | - |
| email | anyOf<string \| null> | - |
| avatar_url* | string | - |
| about | string | - |
| favorite_tags | string | - |
| theme | string | - |

### UserMeResponse

Full user profile. Email hidden for API key auth.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| username* | string | - |
| slug* | string | - |
| avatar_url* | string | - |
| theme | string | - |
| is_staff | boolean | - |
| is_superuser | boolean | - |
| about | string | - |
| favorite_tags | string | - |
| email | anyOf<string \| null> | - |

### UserProfileResponse

Full user profile response.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| id* | integer | - |
| username* | string | - |
| slug* | string | - |
| avatar_url* | string | - |
| is_superuser | boolean | - |
| is_staff | boolean | - |
| date_joined* | integer | - |
| about | string | - |
| favorite_tags | string | - |
| recent_favorites* | array<ref:RecentFavorite> | - |
| recent_comments* | array<ref:RecentComment> | - |

### VoteRequest

Request body for voting on an edit.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| accept* | boolean | - |

### VoteResponse

Response for vote action.

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| success* | boolean | - |
| upvotes* | integer | - |
| downvotes* | integer | - |
