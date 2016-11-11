module.exports = {
  pxToAlg: (left, top) => {
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    var ranks = [1, 2, 3, 4, 5, 6, 7, 8].reverse()
    return files[parseInt(left, 10) / 45] + ranks[parseInt(top, 10) / 45]
  },
  numToAlg: num => {
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    var counter = 0
    for (num++; num > 8; num -= 8) counter++
    return files[counter] + num
  },
  algToNum: alg => {
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return files.indexOf(alg[0]) * 8 + +alg[1]
  }
}
