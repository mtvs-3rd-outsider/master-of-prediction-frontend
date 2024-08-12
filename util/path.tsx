export const getParentPath = (currentPath: string): string => {
    const pathSegments = currentPath.split('/');
    if (pathSegments.length > 1) {
      pathSegments.pop(); // 마지막 세그먼트 제거
    }
    return pathSegments.join('/') || '/';
  };