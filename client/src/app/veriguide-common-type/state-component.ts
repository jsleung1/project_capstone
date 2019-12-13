// to implement that interface when the data of the component requires to be varied by state change

export interface StateComponent {
  enterState(): void;
  leaveState(): void;
  initVars(): void;
  resetVars(): void;
}
