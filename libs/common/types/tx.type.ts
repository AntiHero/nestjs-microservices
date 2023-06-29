export type Tx<PS> = Omit<
  PS,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
