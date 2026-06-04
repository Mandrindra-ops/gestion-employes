import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { EmployeeList } from "./employees/EmployeeList";
import { EmployeeEdit } from "./employees/EmployeeEdit";
import { EmployeeShow } from "./employees/EmployeeShow";
import { EmployeeCreate } from "./employees/EmployeeCreate";
import { InternList } from "./interns/InternList";
import { InternEdit } from "./interns/InternEdit";
import { InternShow } from "./interns/InternShow";
import { InternCreate } from "./interns/InternCreate";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource
      name="employees"
      list={EmployeeList}
      edit={EmployeeEdit}
      show={EmployeeShow}
      create={EmployeeCreate}
    />
    <Resource
      name="interns"
      list={InternList}
      edit={InternEdit}
      show={InternShow}
      create={InternCreate}
    />
  </Admin>
);
