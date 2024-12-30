import { Inject, Injectable } from "@nestjs/common";
import {
  ProviderOptionsSymbol,
  TypeOptions,
} from "@/provider/provider.constans";
import { BaseOAuthService } from "@/provider/services/base-oauth.service";

@Injectable()
export class ProviderService {
  constructor(
    @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions,
  ) {}

  public onModuleInit() {
    for (const provider of this.options.services) {
      provider.baseUrl = this.options.baseUrl;
    }
  }

  public findByService(service: string): BaseOAuthService | null {
    return this.options.services.find((s) => s.name === service) ?? null;
  }
}
