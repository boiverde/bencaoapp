import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Search, Filter, Heart, Image as ImageIcon, Camera, MoveVertical as MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Mock data
const POSTS = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Mariana',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    image: 'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Momento especial de louvor na igreja hoje! Gratidão a Deus por mais um domingo abençoado com meus irmãos em Cristo. O Senhor tem feito maravilhas em nossas vidas. "Cantai ao Senhor um cântico novo, porque ele tem feito maravilhas; a sua destra e o seu braço santo lhe alcançaram a vitória." Salmos 98:1 🙏✨',
    likes: 45,
    timestamp: '2h atrás',
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'João',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    image: 'https://images.pexels.com/photos/236339/pexels-photo-236339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Retiro de jovens 2025! Que Deus continue abençoando nossa juventude. Foram dias intensos de comunhão, adoração e aprendizado da palavra. "Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito, na fé, na pureza." 1 Timóteo 4:12 🙌',
    likes: 38,
    timestamp: '5h atrás',
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Gabriela',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    image: 'https://images.pexels.com/photos/935944/pexels-photo-935944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Gratidão pelo encontro de casais hoje. Que benção compartilhar experiências e aprender mais sobre como construir um casamento baseado nos princípios de Deus. "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha." 1 Coríntios 13:4 ❤️',
    likes: 72,
    timestamp: '1d atrás',
  },
];

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');

  const handleNewPost = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Here you would handle the new post creation
      console.log('New post image:', result.assets[0].uri);
    }
  };

  const handleCaptionChange = (text: string) => {
    if (text.length <= 1000) {
      setNewPostCaption(text);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.image }} style={styles.userAvatar} />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <TouchableOpacity>
          <MoreVertical size={20} color={Theme.colors.text.medium} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.postInfo}>
        <Text style={styles.likesCount}>{item.likes} curtidas</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.captionName}>{item.user.name}</Text>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade Abençoada</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar publicações..."
            placeholderTextColor={Theme.colors.text.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.postsList}
      />

      <TouchableOpacity style={styles.newPostButton} onPress={handleNewPost}>
        <Camera size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  filterButton: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    ...Theme.shadows.small,
  },
  postsList: {
    padding: Theme.spacing.md,
  },
  postCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.small,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.sm,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
  },
  actionButton: {
    marginRight: Theme.spacing.md,
  },
  postInfo: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },
  likesCount: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.xs,
  },
  captionName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginRight: Theme.spacing.xs,
  },
  caption: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    flex: 1,
  },
  timestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  newPostButton: {
    position: 'absolute',
    right: Theme.spacing.md,
    bottom: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.medium,
  },
});