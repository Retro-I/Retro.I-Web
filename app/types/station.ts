import { v4 as uuidv4 } from "uuid";

export class Station {
  color: string = "";
  id: string = uuidv4();
  logo: string = "";
  name: string = "";
  src: string = "";
}
