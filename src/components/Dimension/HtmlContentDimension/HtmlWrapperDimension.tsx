import { Html } from "@react-three/drei";

interface PropsI {
  children: React.ReactNode;
}
export const HtmlWrapperDimension: React.FC<PropsI> = (props) => {
  const { children } = props;

  return <Html zIndexRange={[1]}>{children}</Html>;
};
