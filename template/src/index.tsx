{#normalize_css#}import './models';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routers } from './routers/router';
{#foca_provider_import#}
{#antd_provider_import#}

createRoot(document.querySelector('#root')!).render(
  {#antd_provider_tag_start#}
    {#foca_provider_tag_start#}
      <RouterProvider router={createHashRouter(routers)} />
    {#foca_provider_tag_end#}
  {#antd_provider_tag_end#}
);
