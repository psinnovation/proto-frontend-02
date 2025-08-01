import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { DashboardLayout } from '../../layouts/dashboard';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const Page404 = lazy(() => import('src/pages/error/404'));
//const DashboardPage = lazy(() => import('src/pages/dashboard'));
const ImportDdtPage = lazy(() => import('src/pages/dashboard/import-ddt/import-ddt'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
        {/*<DashboardLayout>
          <ImportDdtPage />
        </DashboardLayout>*/}
      </Suspense>
    ),
  },

  // Auth
  ...authRoutes,
  ...authDemoRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
