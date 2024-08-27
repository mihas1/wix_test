import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import { Editor } from "./components";
import store from './redux/store'
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <Editor />
  </Provider>
);
