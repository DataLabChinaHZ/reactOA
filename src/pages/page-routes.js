// 此文件是通过脚本生成的，直接编辑无效！！！

// 不需要导航框架的页面路径
export const noFrames = [
    '/login',
    '/login1',
];

// 不需要登录就可以访问的页面路径
export const noAuths = [
    '/login',
    '/login1',
];

// 需要keep alive 页面
export const keepAlives = [
    {
        path: '/iframe_page_/:src',
        keepAlive: true,
    },
    {
        path: '/',
        keepAlive: false,
    },
    {
        path: '/login',
        keepAlive: false,
    },
    {
        path: '/login1',
        keepAlive: false,
    },
];

// 页面路由配置
export default [
    {
        path: '/iframe_page_/:src',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\iframe\\index.jsx'),
    },
    {
        path: '/',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\home\\index.jsx'),
    },
    {
        path: '/login',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\login\\index.jsx'),
    },
    {
        path: '/menu-permission',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\menu-permission\\index.jsx'),
    },
    {
        path: '/login1',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\login1\\index.jsx'),
    },
    {
        path: '/settings',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\setting\\index.jsx'),
    },
    {
        path: '/users/_/edit/:id',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\users\\Edit.jsx'),
    },
    {
        path: '/users',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\users\\index.jsx'),
    },
    {
        path: '/user-center',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\user-center\\index.jsx'),
    },
    {
        path: '/example/ajax',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\examples\\ajax\\index.jsx'),
    },
    {
        path: '/example/customer-header',
        component: () => import('F:\\UtilWorkSpace\\react-admin\\src\\pages\\examples\\customer-header\\index.jsx'),
    },
];
