
declare module "*.html" {
  const Template: <T> ( input: T ) => T;
  export default Template;
}

declare module "*.pug" {
  const Template: <T> ( input: T ) => T;
  export default Template;
}

declare module "*.yaml" {
  const data: any;
  export default data;
}
