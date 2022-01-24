export interface ISetting<T> {
  readonly defaultValue: T;
  readonly value: T;
  readonly storageKey: string;
  readonly validation: (v: T) => boolean;

  setValue(v: T | undefined): boolean;

  save(): Promise<void>;

  loadSetting(): Promise<boolean>;

  setAndSaveValue(v: T): Promise<boolean>;
}