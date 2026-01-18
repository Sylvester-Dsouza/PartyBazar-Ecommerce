import { loadEnv, Modules, defineConfig } from '@medusajs/utils'
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  WORKER_MODE,
  S3_FILE_URL,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY
} from './src/lib/constants'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS || "http://localhost:9000",
      authCors: AUTH_CORS || "http://localhost:9000",
      storeCors: STORE_CORS || "http://localhost:8000",
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
    vite: () => ({
      plugins: [
        {
          name: 'hide-admin-links',
          transformIndexHtml(html) {
            return html.replace(
              '</head>',
              `<style>
                /* Hide Changelog and Documentation links from profile menu */
                [data-testid="user-menu-changelog"],
                [data-testid="user-menu-documentation"],
                a[href*="changelog"],
                a[href*="docs.medusajs.com"] {
                  display: none !important;
                }
                /* Cancelled Order Row Styling */
                tr.order-cancelled-row td {
                    background-color: #FEF2F2 !important; /* light red */
                }
                tr.order-cancelled-row {
                    border-left: 4px solid #EF4444 !important; /* red border */
                    box-shadow: inset 4px 0 0 0 #EF4444;
                }

                /* Delivered/Shipped Order Row Styling */
                tr.order-delivered-row td {
                    background-color: #F0FDF4 !important; /* light green */
                }
                tr.order-delivered-row {
                    border-left: 4px solid #22C55E !important; /* green border */
                    box-shadow: inset 4px 0 0 0 #22C55E;
                }
              </style>
              <script>
                // Observer to highlight Cancelled and Delivered orders
                const observer = new MutationObserver(() => {
                    const cells = document.querySelectorAll('td');
                    cells.forEach(td => {
                        const text = td.textContent.trim();
                        
                        // Cancelled -> Red
                        if (text === 'Canceled') {
                            const tr = td.closest('tr');
                            if (tr) tr.classList.add('order-cancelled-row');
                        }

                        // Delivered/Shipped/Completed -> Green
                        if (['Delivered', 'Shipped', 'Completed'].includes(text)) {
                            const tr = td.closest('tr');
                            if (tr) tr.classList.add('order-delivered-row');
                        }
                    });
                });
                
                // Start observing after a short delay to ensure app mount
                setTimeout(() => {
                    const root = document.getElementById('root') || document.body;
                    observer.observe(root, { childList: true, subtree: true });
                }, 1000);
              </script>
              </head>`
            )
          }
        }
      ]
    })
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          ...(S3_FILE_URL && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY ? [{
            resolve: '@medusajs/file-s3',
            id: 's3',
            options: {
              file_url: S3_FILE_URL,
              access_key_id: S3_ACCESS_KEY_ID,
              secret_access_key: S3_SECRET_ACCESS_KEY,
              region: S3_REGION,
              bucket: S3_BUCKET,
              endpoint: S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            }
          }] : [{
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`
            }
          }])
        ]
      }
    },
    ...(REDIS_URL ? [{
      resolve: '@medusajs/medusa/caching',
      options: {
        providers: [
          {
            resolve: '@medusajs/caching-redis',
            id: 'caching-redis',
            is_default: true,
            options: {
              redisUrl: REDIS_URL,
              ttl: 3600,
            }
          }
        ]
      }
    }] : []),
    ...(REDIS_URL ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: REDIS_URL
      }
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          redisUrl: REDIS_URL,
        }
      }
    }] : []),
    ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          {
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }
        ]
      }
    }] : []),
    // Menu Module
    {
      resolve: './src/modules/menu',
    },
    // Blog Module
    {
      resolve: './src/modules/blog',
    },
    // Vendor Module
    {
      resolve: './src/modules/vendor',
    },
  ],
  plugins: [
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY
        },
        settings: {
          products: {
            type: 'products',
            enabled: true,
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
          }
        }
      }
    }] : [])
  ]
})
