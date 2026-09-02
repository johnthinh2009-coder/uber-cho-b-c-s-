import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n';

export default function NotFoundScreen() {
  const { t } = useI18n();
  return (
    <>
      <Stack.Screen options={{ title: t('notFound.screenTitle') }} />
      <Screen>
        <View style={styles.container}>
          <Text variant="title" align="center">
            {t('notFound.title')}
          </Text>
          <Text variant="body" color="textSecondary" align="center">
            {t('notFound.body')}
          </Text>
          <Link href="/home" asChild>
            <Button label={t('common.goHome')} icon="home-outline" />
          </Link>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
});
