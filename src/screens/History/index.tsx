import * as React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StatusBar,
  Text,
} from 'react-native';
import {WrapperView} from '../../components/Wrappers/SafeAreaWrapper';
import {ContentView} from '../../components/Wrappers/ContentView';
import {TextType} from '../../components/Text/TextView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import styled from 'styled-components';
import {RootStackParamList} from '../../utils/constants';
import {Header} from '../../components/UI/Header';
import {strings} from './strings';
import {Transaction} from '../../types/Home/transaction';
import ListItem from '../../components/ListItem/ListItem';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import transactionsApi from '../../api';
import {useCallback} from 'react';
import useSWR from 'swr';

const {transactionServices: transactionAPI} = transactionsApi;

export const Logo = styled(Image)`
  width: 100px;
  height: 80px;
`;

const TextNotFound = styled(Text)`
  padding: 20px;
`;

const HistoryScreen = ({
  navigation: {navigate},
}: NativeStackScreenProps<RootStackParamList, 'History'>) => {
  const onHandlePress = (item: Transaction): void => {
    navigate('TransactionDetail', {transaction: item});
  };

  const {
    data,
    isValidating,
    mutate: mutateGet,
  } = useSWR('get', transactionAPI.getTransactions);

  const onRefresh = useCallback(() => {
    mutateGet();
  }, [mutateGet]);

  const renderItem: ListRenderItem<Transaction> = ({item}) => (
    <ListItem onHandlePress={onHandlePress} item={item} />
  );
  return (
    <WrapperView>
      <ContentView fullWidth={true}>
        <StatusBar barStyle="dark-content" />
        <Header
          title={strings.history.infoTitle}
          subtitle={strings.history.infoSubtitle}
          textTypeTitle={TextType.bigBold}
          buttonBack={false}
          secondaryComponent={() => (
            <Logo source={require('../../assets/ripio-logo.png')} />
          )}
        />
        {isValidating && <CustomActivityIndicator />}
        {data?.Transactions.length === 0 && !isValidating && (
          <TextNotFound>{strings.history.notFound}</TextNotFound>
        )}

        {data?.Transactions && (
          <FlatList
            data={data?.Transactions.sort(
              (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
            )}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={isValidating} onRefresh={onRefresh} />
            }
          />
        )}
      </ContentView>
    </WrapperView>
  );
};

export default HistoryScreen;
