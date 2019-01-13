/* processData()
 * Chains together promises in data pipeline.
 */
const processData = (lyricsCorpus) => {
  return new Promise((resolve, reject) => {
    if (lyricsCorpus.length === 0) {
      reject('Lyrics corpus is empty');
    }
    let count = _counts(lyricsCorpus);
    let matrix = _matrix(lyricsCorpus);
    resolve({ count, matrix });
  })
    .then(({ count, matrix }) => {
      let groups = _groups(matrix);
      return { count, matrix, groups };
    })
    .then(({ count, matrix, groups }) => {
      let colors = _colors(lyricsCorpus, groups);
      return { count, matrix, groups, colors };
    });
};

/* counts()
 * Count instances of each word
 *  Input
 *   - lyricsCorpus: array of words in lyrical order
 *  Output
 *   - count: object (k,v) => (word, {index, count})
 */
const _counts = (lyricsCorpus) => {
  // const { lyricsCorpus } = this.props;

  // count and put in dictionary
  var count = {};
  var uniqueIndex = 1;
  for (let i = 0; i < lyricsCorpus.length; i++) {
    count[lyricsCorpus[i]] = {
      index: uniqueIndex++,
      count: count[lyricsCorpus[i]] ? parseInt(count[lyricsCorpus[i]]) + 1 : 0,
    };
  }
  return count;
};

/* matrix()
 * Count instances of each word
 *  Input
 *   - lyricsCorpus: array of words in lyrical order
 *  Output
 *   - matrix: 2D array of pixel objects
 */
const _matrix = (lyricsCorpus) => {
  // build empty matrix
  var matrix = [];
  for (let _i = 0; _i < lyricsCorpus.length; _i++) {
    matrix[_i] = new Array(lyricsCorpus.length);
  }

  // populate matrix
  for (let row = 0; row < lyricsCorpus.length; row++) {
    for (let col = row; col < lyricsCorpus.length; col++) {
      let index = 0;
      let isEmpty = true;
      if (lyricsCorpus[row] === lyricsCorpus[col]) {
        // index = count[lyricsCorpus[row]].index;
        isEmpty = false;
      }
      // populate both halves
      matrix[row][col] = {
        r: row,
        c: col,
        // i: index,
        isEmpty,
      };
      matrix[col][row] = {
        r: col,
        c: row,
        // i: index,
        isEmpty,
      };
    }
  }
  return matrix;
};

/* _DFS()
 * Perform depth first traversal to find connected islands
 *  Input
 *   - matrix: 2D array of pixel objects
 *   - rootX: base x coordinate
 *   - rootY: base y coordinate
 *   - visited: 2D boolean matrix of which points were visited
 *   - group: array to fill
 *   - groupIndex: unique identifier for which group pixel is in
 *  Output
 *   - none
 */
const _DFS = (matrix, rootX, rootY, visited, group) => {
  // DFS traverse to find all neighbors on island and mark visited
  // const { matrix } = this.state;
  let toVisit = [matrix[rootX][rootY]],
    currNode = null;

  let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1], // relative neighboring indices
    colNbr = [-1, 0, 1, -1, 1, -1, 0, 1],
    side = visited.length;

  while (toVisit.length > 0) {
    currNode = toVisit.pop();
    visited[currNode.r][currNode.c] = 1; // mark visited

    // Add neighboring nodes that are not empty
    for (let i = 0; i < 8; i++) {
      let x = currNode.r + rowNbr[i];
      let y = currNode.c + colNbr[i];
      if (x >= 0 && x < side && y >= 0 && y < side) {
        // within boundaries
        if (visited[x][y] === 0 && matrix[x][y].isEmpty === false) {
          // not visited and not empty
          // matrix[x][y].group = groupIndex++; // add group index to data
          group.push(matrix[x][y]); // add node to island
          toVisit.push(matrix[x][y]); // visit neighbors of this node too
        }
      }
    }
  }
};

/* groups()
 * Find pixels that are connected to each other. An island is defined
 * as a group of pixels that are adjacent or diagonal to each other.
 *  Input
 *   - matrix: 2D array of pixel objects
 *  Output
 *   - groups: array of arrays of pixel objects
 */
const _groups = (matrix) => {
  // const { matrix } = this.state;
  var groups = []; // all islands kept here
  var groupIndex = 1;

  // build empty matrix of visited nodes
  var visited = [];
  for (let _i = 0; _i < matrix.length; _i++) {
    visited[_i] = new Array(matrix.length).fill(0);
  }
  for (let row = 0; row < matrix.length; row++) {
    for (let col = row; col < matrix.length; col++) {
      // Visit unvisited cells that aren't empty
      if (visited[row][col] === 0 && matrix[row][col].i !== 0) {
        var group = [matrix[row][col]];
        _DFS(matrix, row, col, visited, group); // go off and find an island!
        groups.push(group); // island has been found and visited
      }
    }
  }
  /* Add index by group for color scale
   * Put longest diagonal group to end so that coloring begins with other groups first
   */
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const diagonal = groups.splice(0, 1);
  // shuffle(groups);
  groups.sort((a, b) => b.length - a.length);
  groups = groups.concat(diagonal);

  return groups;
};

/* colors()
 * Create hash for colors for each unique word
 *  Input
 *   - groups: array of arrays of pixel objects
 *  Output
 *   - colors: object (k,v) => (word, colorIndex)
 */
const _colors = (lyricsCorpus, groups) => {
  var colors = {};
  var colorIndex = 0;
  // add index by group for color scale
  // put longest diagonal group to end so that coloring begins with other groups first
  groups.forEach((group) => {
    group.forEach((point) => {
      if (!colors.hasOwnProperty(lyricsCorpus[point.r])) {
        colors[lyricsCorpus[point.r]] = colorIndex++;
      }
    });
  });
  console.log('COLORS');
  console.log(colors);
  return colors;
};

export { processData };
