export class UUID {
  constructor(private val: string) {}

  public isValid(): boolean {
    const re = new RegExp(
      '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    );
    return re.test(this.val);
  }
}
