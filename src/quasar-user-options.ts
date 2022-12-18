import "./styles/quasar.scss";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";

import { Notify } from "quasar";
import langPL from "quasar/lang/pl";

// To be used on app.use(Quasar, { ... })
export default {
  config: {},
  plugins: {
    Notify,
    lang: langPL
  },
};
