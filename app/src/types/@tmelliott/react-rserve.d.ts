declare module "@tmelliott/react-rserve" {
  interface ValueProps {
    host: string;
    [key: string]: any;
  }

  interface RserveProviderProps {
    value: ValueProps;
    children: ReactNode;
  }

  interface RserveProps {
    host: string;
    children: ReactNode;
  }

  // type Rfun = ({
  //   ...args,
  //   callback,
  // }: {
  //   [key: string]: any;
  //   callback: (err: string, funs: any) => Promise<void> | void;
  // }) => void;

  interface Rtype {
    ocap: (callback: (err: string | undefined, funs: any) => void) => void;
    running: boolean;
  }

  export interface RContextType {
    R: Rtype | null;
    connecting: boolean;
  }

  type RC = Context<RContextType | null>;
  type RCProvider = ProviderExoticComponent<ProviderProps<RContextType | null>>;
  type RCProviderResult = ReturnType<RCProvider>;

  export function useRserve(): RContextType;
  export const Rserve: ({ host, children }: RserveProps) => RCProviderResult;
}
