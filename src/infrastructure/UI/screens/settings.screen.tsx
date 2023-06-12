import React, { useEffect, useState } from "react";

import "./settings.page.css";

import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { TouchableOpacity, View } from "react-native";
import NormalText from "../components/texts/NormalText";
import Title from "../components/texts/Title";

const lngs: any = {
  en: { nativeName: "English" },
  es: { nativeName: "Español" },
  pt: { nativeName: "Português" },
  de: { nativeName: "Deutsch" },
};
export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  return (
    <View>
      {/* Reemplaza Navbar y Footer con componentes React Native si es necesario */}
      <View>
        <Title>{t('Settings')}</Title>
        <View>
          {Object.keys(lngs).map((lng) => (
            <TouchableOpacity
              key={lng}
              onPress={() => i18n.changeLanguage(lng)}
              disabled={i18n.resolvedLanguage === lng}
            >
              <NormalText>{lngs[lng].nativeName}</NormalText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};


