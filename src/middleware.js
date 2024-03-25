import {NextRequest, NextResponse} from "next/server";


    const allowedOrigins = [
<<<<<<< HEAD
      'http://sharonobrien.com',
      'https://www.sharonobrien.com',
      'http://www.sharonobrien.com',
      'https://sharonobrien.com',
    'http://localhost:3000/',
    'https://mindful-spending-22924.vercel.app/',
    'https://mindful-spending.vercel.app/',
=======
        'http://sharonobrien.com',
          'https://www.sharonobrien.com',
          'http://www.sharonobrien.com',
          'https://sharonobrien.com',
        'http://localhost:3000/',
        'https://mindful-spending-22924.vercel.app/',
        'https://mindful-spending.vercel.app/',
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
    ]
    const corsOptions = {
        'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': "true",
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    }
    export function middleware(request){
        // Check the origin from the request
      const origin = request.headers.get('origin') ?? ''
      const isAllowedOrigin = allowedOrigins.includes(origin)
      // Handle preflighted requests
      const isPreflight = request.method === 'OPTIONS'
      if (isPreflight) {
        const preflightHeaders = {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          ...corsOptions,
        }

        return NextResponse.json({}, { headers: preflightHeaders })
  }
    //simple requests
    const response = NextResponse.next()
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

   // console.log('response',response)
    return response
}
// switch(role){
//   case "ADMIN":
//     // Add the paths that the nurse can access here
//     if (!request.nextUrl.pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
//     break;
//   // case "OWNER":
//   //   // Add the paths that the pathologist can access here
//   //   if (!request.nextUrl.pathname.startsWith("/image")) {
//   //     return NextResponse.redirect(new URL("/image", request.url));
//   //   }
//   //   break;
//   default:
//     return NextResponse.redirect(new URL("/login", request.url))
// }
;
//export{default} from 'next-auth/middleware'
export const config = {
    matcher:[
<<<<<<< HEAD
    "/my-spending-plan/:path*",
=======
      "/my-spending-plan/:path*",
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
    "/transaction/:path*",
    "/addCategory",  
    "/api/:path*"
    
]
}