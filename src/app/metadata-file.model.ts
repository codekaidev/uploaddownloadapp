import { IsActive } from "./is-active.enum";

export class MetadataFile {
  constructor(
    public id: string,
    public fileName: string,
    public fileSize: number,
    public mimeType: string,
    public fileLocation:string,
    public isActive:IsActive
  ) {}
}
