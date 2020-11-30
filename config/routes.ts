export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin',
            name: 'user',
            icon: 'user',
            // component: './Admin',
            // authority: ['admin'],
            // redirect: '/admin/ManageUsers',
            routes: [
              {
                path: '/admin/ManageUsers',
                name: 'management',
                icon: 'usergroup-delete',
                component: './admin/ManageUsers',
              },
              {
                path: '/admin/Application',
                name: 'beta-application',
                icon: 'usergroup-add',
                component: './admin/Application',
              },
              {
                path: '/admin/InviteCode',
                name: 'inviteCode-management',
                icon: 'user-add',
                component: './admin/InviteCode',
              },
            ]
          },
          {
            path: '/node',
            name: 'node',
            icon: 'global',
            routes: [
              {
                name: 'management',
                icon: 'edit',
                path: '/node/ManageNodes',
                component: './node/ManageNodes',
              },
              {
                name: 'audited',
                icon: 'check-circle',
                path: '/node/ReviewNodes',
                component: './node/ReviewNodes',
              },
            ]
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
