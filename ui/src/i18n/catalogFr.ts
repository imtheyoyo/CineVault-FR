import type { MessageKey } from "./catalog";
import { activity } from "./messages/fr/activity";
import { artwork } from "./messages/fr/artwork";
import { common } from "./messages/fr/common";
import { copies } from "./messages/fr/copies";
import { deleteMessages } from "./messages/fr/delete";
import { drives } from "./messages/fr/drives";
import { history } from "./messages/fr/history";
import { library } from "./messages/fr/library";
import { movie } from "./messages/fr/movie";
import { onboarding } from "./messages/fr/onboarding";
import { rename } from "./messages/fr/rename";
import { scrape } from "./messages/fr/scrape";
import { settings } from "./messages/fr/settings";
import { shell } from "./messages/fr/shell";
import { show } from "./messages/fr/show";
import { torrents } from "./messages/fr/torrents";

/**
 * The French string catalogue, one file per area under `messages/fr/` like the English one.
 * Typed as a full record of the English keys, so a missing or extra key fails the type check.
 */
export const fr: Readonly<Record<MessageKey, string>> = {
  ...shell,
  ...library,
  ...movie,
  ...show,
  ...scrape,
  ...artwork,
  ...rename,
  ...drives,
  ...torrents,
  ...history,
  ...activity,
  ...settings,
  ...onboarding,
  ...deleteMessages,
  ...copies,
  ...common,
};
