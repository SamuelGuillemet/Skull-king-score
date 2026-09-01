const FORMAT = Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
});

export const getFormattedDate = () => {
  return FORMAT.format(new Date());
};
