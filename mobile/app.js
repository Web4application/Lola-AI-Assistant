import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'

export default function App() {
  const [journal, setJournal] = useState([])

  useEffect(() => {
    axios.get('http://<YOUR_LOCAL_IP>:8000/journal').then(res => {
      setJournal(res.data)
    })
  }, [])

  return (
    <View style={{ padding: 20 }}>
      {journal.map((entry, i) => (
        <Text key={i}>{entry}</Text>
      ))}
    </View>
  )
}
