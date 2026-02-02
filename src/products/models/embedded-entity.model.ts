export class EmbeddedEntityModel {
  id?: string;
  name?: string;
  slug?: string;

  constructor(partial: Partial<EmbeddedEntityModel>) {
    Object.assign(this, partial);
  }
}
