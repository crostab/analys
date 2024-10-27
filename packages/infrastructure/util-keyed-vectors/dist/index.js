const toKeyComparer = comparer => {
  return (a, b) => comparer(a[0], b[0])
};

export { toKeyComparer };
