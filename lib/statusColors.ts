export const statusColorMap: Record<string, { bg: string; text: string }> = {
  запланирован: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  открыт: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  сохранен: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  закрыт: { bg: 'bg-green-500/20', text: 'text-green-400' }
}

export const getStatusColor = (statusName: string) => {
  const normalized = statusName.toLowerCase().trim()
  return statusColorMap[normalized] || { bg: 'bg-gray-500/20', text: 'text-gray-400' }
}
