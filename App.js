import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Share } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [files, setFiles] = useState([]);

  const pickFiles = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: "*/*",
    });

    if (!result.canceled) {
      setFiles([...files, ...result.assets]);
    }
  };

  const shareFiles = async () => {
    if (files.length === 0) return alert("No files selected!");
    
    // In a real local network app, you'd POST to a local IP here.
    // For now, we use the native Share API for local broadcast.
    const fileUris = files.map(f => f.uri);
    await Share.share({
      url: fileUris[0], // Sharing the primary file
      message: `Sharing ${files.length} files via LocaShare`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Loca<Text style={{color: '#4ADE80'}}>Share</Text></Text>
      
      <View style={styles.card}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={pickFiles}>
          <Text style={styles.buttonText}>+ Select Files</Text>
        </TouchableOpacity>

        <FlatList
          data={files}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Text style={styles.fileText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.fileSize}>{(item.size / 1024).toFixed(1)} KB</Text>
            </View>
          )}
          style={styles.list}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={shareFiles}>
          <Text style={styles.buttonTextBold}>SEND TO NETWORK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark Slate
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 40,
  },
  card: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    height: '70%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonPrimary: {
    backgroundColor: '#22C55E', // Greenish
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#4ADE80',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#4ADE80', fontWeight: '600' },
  buttonTextBold: { color: '#000', fontWeight: '800' },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  fileText: { color: '#CBD5E1', flex: 1 },
  fileSize: { color: '#64748B', marginLeft: 10 },
  list: { marginVertical: 10 }
});
