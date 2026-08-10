import type { MaybeRefOrGetter } from "vue";

const DEFAULT_APP_NAME = "Minuman Murah";
const DEFAULT_APP_LOGO = "/assets/img/logo.png";

const getConfigImageOrValue = (configData: any): string | null => {
  if (!configData) return null;

  if (configData.value_image) {
    return configData.value_image;
  }

  if (configData.value && typeof configData.value === "string") {
    return configData.value;
  }

  return null;
};

export const useAppIdentity = () => {
  const { fetchPublicConfig } = useConfig();

  const appName = useState<string>("app-name", () => DEFAULT_APP_NAME);
  const logoUrl = useState<string>("app-logo-url", () => DEFAULT_APP_LOGO);
  const faviconUrl = useState<string>("app-favicon-url", () => DEFAULT_APP_LOGO);
  const isLoaded = useState<boolean>("app-identity-loaded", () => false);

  const loadAppIdentity = async () => {
    try {
      const [appNameRes, logoRes, faviconRes] = await Promise.all([
        fetchPublicConfig("app_name"),
        fetchPublicConfig("store_logo_website"),
        fetchPublicConfig("store_favicon"),
      ]);

      const appNameValue = appNameRes?.data?.value;
      if (appNameValue && typeof appNameValue === "string") {
        appName.value = appNameValue;
      }

      logoUrl.value = getConfigImageOrValue(logoRes?.data) || DEFAULT_APP_LOGO;
      faviconUrl.value = getConfigImageOrValue(faviconRes?.data) || DEFAULT_APP_LOGO;
      isLoaded.value = true;
    } catch (error) {
      console.error("Failed to load app identity:", error);
      logoUrl.value = DEFAULT_APP_LOGO;
      faviconUrl.value = DEFAULT_APP_LOGO;
    }
  };

  if (import.meta.client) {
    const refresh = () => {
      loadAppIdentity();
    };

    onMounted(() => {
      if (!isLoaded.value) {
        loadAppIdentity();
      }
      window.addEventListener("app-settings-updated", refresh);
    });

    onUnmounted(() => {
      window.removeEventListener("app-settings-updated", refresh);
    });
  }

  return {
    appName,
    logoUrl,
    faviconUrl,
    loadAppIdentity,
  };
};

export const useAppTitle = (pageTitle?: MaybeRefOrGetter<string>) => {
  const { appName } = useAppIdentity();
  const fullTitle = computed(() => {
    const title = pageTitle ? toValue(pageTitle) : "";
    return title ? `${title} - ${appName.value}` : appName.value;
  });
  const description = computed(() => `${appName.value} - Toko Online Terpercaya`);

  useHead({
    title: fullTitle,
    meta: [
      {
        key: "description",
        name: "description",
        content: description,
      },
      {
        key: "og:title",
        property: "og:title",
        content: fullTitle,
      },
      {
        key: "og:description",
        property: "og:description",
        content: description,
      },
    ],
  });
};
