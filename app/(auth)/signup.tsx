import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { Link } from 'expo-router';
import { Mail, Lock, User, Calendar, ChevronRight, Church, MapPin, Music, Ruler, Users, GraduationCap, Zodiac, BookOpen } from 'lucide-react-native';
import DenominationModal from '@/components/UI/DenominationModal';
import LocationModal from '@/components/UI/LocationModal';
import PhotoUpload from '@/components/UI/PhotoUpload';
import * as ImagePicker from 'expo-image-picker';

const EDUCATION_LEVELS = [
  'Ensino Fundamental',
  'Ensino Médio',
  'Ensino Técnico',
  'Graduação',
  'Pós-graduação',
  'Mestrado',
  'Doutorado'
];

const ZODIAC_SIGNS = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes'
];

export default function SignupScreen() {
  const [denominationModalVisible, setDenominationModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedDenomination, setSelectedDenomination] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<{ state?: string; city?: string }>({});
  const [photo, setPhoto] = useState<string>();
  const [aboutMe, setAboutMe] = useState('');
  const [favoriteWorship, setFavoriteWorship] = useState('');
  const [height, setHeight] = useState('');
  
  // More About Me fields
  const [children, setChildren] = useState('0');
  const [education, setEducation] = useState<string>();
  const [zodiacSign, setZodiacSign] = useState<string>();
  const [churchFrequency, setChurchFrequency] = useState('1');

  const handleSelectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleAboutMeChange = (text: string) => {
    if (text.length <= 500) {
      setAboutMe(text);
    }
  };

  const handleFavoriteWorshipChange = (text: string) => {
    if (text.length <= 30) {
      setFavoriteWorship(text);
    }
  };

  const handleHeightChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 3) {
      setHeight(numericValue);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Bênção Match</Text>
        <Text style={styles.logoSubtext}>Comece sua jornada abençoada</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar Conta</Text>
          <Text style={styles.cardSubtitle}>Preencha seus dados para começar</Text>
          
          <PhotoUpload photo={photo} onPress={handleSelectPhoto} />
          
          <View style={styles.inputContainer}>
            <User size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Theme.colors.text.medium}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Calendar size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento"
              placeholderTextColor={Theme.colors.text.medium}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ruler size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Altura"
              placeholderTextColor={Theme.colors.text.medium}
              keyboardType="numeric"
              value={height}
              onChangeText={handleHeightChange}
            />
            {height.length > 0 && (
              <Text style={styles.heightUnit}>cm</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setDenominationModalVisible(true)}
          >
            <Church size={20} color={Theme.colors.text.medium} />
            <View style={styles.selectContainer}>
              <Text style={[
                styles.selectText,
                selectedDenomination && styles.selectedText
              ]}>
                {selectedDenomination || 'Selecione sua denominação'}
              </Text>
              <ChevronRight size={20} color={Theme.colors.text.medium} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setLocationModalVisible(true)}
          >
            <MapPin size={20} color={Theme.colors.text.medium} />
            <View style={styles.selectContainer}>
              <Text style={[
                styles.selectText,
                (selectedLocation.state || selectedLocation.city) && styles.selectedText
              ]}>
                {selectedLocation.state && selectedLocation.city
                  ? `${selectedLocation.city}, ${selectedLocation.state}`
                  : 'Selecione sua localização'}
              </Text>
              <ChevronRight size={20} color={Theme.colors.text.medium} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Theme.colors.text.medium}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry
            />
          </View>

          <View style={styles.aboutMeContainer}>
            <Text style={styles.aboutMeTitle}>Sobre mim</Text>
            <TextInput
              style={styles.aboutMeInput}
              placeholder="Conte um pouco sobre você, seus interesses e o que busca em um relacionamento..."
              placeholderTextColor={Theme.colors.text.medium}
              multiline
              textAlignVertical="top"
              value={aboutMe}
              onChangeText={handleAboutMeChange}
            />
            <Text style={styles.characterCount}>
              {aboutMe.length}/500 caracteres
            </Text>
          </View>

          <View style={styles.favoriteWorshipContainer}>
            <Text style={styles.favoriteWorshipTitle}>Louvor favorito</Text>
            <View style={styles.favoriteWorshipInputContainer}>
              <Music size={20} color={Theme.colors.text.medium} />
              <TextInput
                style={styles.favoriteWorshipInput}
                placeholder="Ex: Deus é Deus - Delino Marçal"
                placeholderTextColor={Theme.colors.text.medium}
                value={favoriteWorship}
                onChangeText={handleFavoriteWorshipChange}
              />
            </View>
            <Text style={styles.characterCount}>
              {favoriteWorship.length}/30 caracteres
            </Text>
          </View>

          <View style={styles.moreAboutMeContainer}>
            <Text style={styles.sectionTitle}>Mais sobre mim</Text>
            
            <View style={styles.moreAboutMeSection}>
              <View style={styles.moreAboutMeRow}>
                <Users size={20} color={Theme.colors.text.medium} />
                <Text style={styles.moreAboutMeLabel}>Filhos</Text>
                <View style={styles.pickerContainer}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.numberOption,
                        children === i.toString() && styles.numberOptionSelected
                      ]}
                      onPress={() => setChildren(i.toString())}
                    >
                      <Text style={[
                        styles.numberOptionText,
                        children === i.toString() && styles.numberOptionTextSelected
                      ]}>
                        {i}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.moreAboutMeRow}>
                <GraduationCap size={20} color={Theme.colors.text.medium} />
                <Text style={styles.moreAboutMeLabel}>Formação</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.educationScroll}>
                  {EDUCATION_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.educationOption,
                        education === level && styles.educationOptionSelected
                      ]}
                      onPress={() => setEducation(level)}
                    >
                      <Text style={[
                        styles.educationOptionText,
                        education === level && styles.educationOptionTextSelected
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.moreAboutMeRow}>
                <Zodiac size={20} color={Theme.colors.text.medium} />
                <Text style={styles.moreAboutMeLabel}>Signo</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.zodiacScroll}>
                  {ZODIAC_SIGNS.map((sign) => (
                    <TouchableOpacity
                      key={sign}
                      style={[
                        styles.zodiacOption,
                        zodiacSign === sign && styles.zodiacOptionSelected
                      ]}
                      onPress={() => setZodiacSign(sign)}
                    >
                      <Text style={[
                        styles.zodiacOptionText,
                        zodiacSign === sign && styles.zodiacOptionTextSelected
                      ]}>
                        {sign}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.moreAboutMeRow}>
                <BookOpen size={20} color={Theme.colors.text.medium} />
                <Text style={styles.moreAboutMeLabel}>Frequência na Igreja</Text>
                <View style={styles.pickerContainer}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <TouchableOpacity
                      key={i + 1}
                      style={[
                        styles.numberOption,
                        churchFrequency === (i + 1).toString() && styles.numberOptionSelected
                      ]}
                      onPress={() => setChurchFrequency((i + 1).toString())}
                    >
                      <Text style={[
                        styles.numberOptionText,
                        churchFrequency === (i + 1).toString() && styles.numberOptionTextSelected
                      ]}>
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.frequencyUnit}>vezes por semana</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Criar conta</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      
      <Text style={styles.verseText}>"Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará." Salmos 37:5</Text>

      <DenominationModal
        visible={denominationModalVisible}
        onClose={() => setDenominationModalVisible(false)}
        onSelect={setSelectedDenomination}
        selectedDenomination={selectedDenomination}
      />

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onSelect={setSelectedLocation}
        selectedState={selectedLocation.state}
        selectedCity={selectedLocation.city}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  logoText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxxl,
    color: Theme.colors.background.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSubtext: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: '85%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  cardTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  cardSubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    paddingVertical: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  heightUnit: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
  },
  selectContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
  },
  selectText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  selectedText: {
    color: Theme.colors.text.dark,
  },
  aboutMeContainer: {
    marginBottom: Theme.spacing.md,
  },
  aboutMeTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  aboutMeInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    height: 120,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  favoriteWorshipContainer: {
    marginBottom: Theme.spacing.md,
  },
  favoriteWorshipTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  favoriteWorshipInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
  },
  favoriteWorshipInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    paddingVertical: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  characterCount: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'right',
    marginTop: Theme.spacing.xs,
  },
  moreAboutMeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  moreAboutMeSection: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  moreAboutMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  moreAboutMeLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
    width: 100,
  },
  pickerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  numberOption: {
    width: 30,
    height: 30,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  numberOptionSelected: {
    backgroundColor: Theme.colors.primary.blue,
  },
  numberOptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  numberOptionTextSelected: {
    color: Theme.colors.background.white,
  },
  educationScroll: {
    flex: 1,
  },
  educationOption: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background.white,
    marginRight: Theme.spacing.xs,
  },
  educationOptionSelected: {
    backgroundColor: Theme.colors.primary.blue,
  },
  educationOptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  educationOptionTextSelected: {
    color: Theme.colors.background.white,
  },
  zodiacScroll: {
    flex: 1,
  },
  zodiacOption: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background.white,
    marginRight: Theme.spacing.xs,
  },
  zodiacOptionSelected: {
    backgroundColor: Theme.colors.primary.blue,
  },
  zodiacOptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  zodiacOptionTextSelected: {
    color: Theme.colors.background.white,
  },
  frequencyUnit: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.sm,
  },
  signupButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  signupButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginRight: Theme.spacing.sm,
  },
  termsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  termsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Theme.colors.primary.blue,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  loginLink: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.pink,
    marginLeft: Theme.spacing.xs,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});