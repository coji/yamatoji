This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You must create a local configuration file `env.development` for stripe.com keys and firebase admin settings

```.env.development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FIREBASE_ADMIN_PROJECT_ID=xxxxxxx-xxxxx
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIExxxxxxxxxx\n-----END PRIVATE KEY-----\n
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@xxxxxxx-xxxxx.iam.gserviceaccount.com
```

then, install node modules and run the development server:

```bash
pnpm install
pnpm run dev
```

# Credit

認証部分のコードは React Query Firebase を一部抜粋・改変して利用しています。
改変した部分は、onAuthStateChanged の unsubscribe 処理を消す対応です。Nextjs + react 18 で動作しなかっためです。

https://github.com/invertase/react-query-firebase
