/** Returns an array of longest increasing subsequences
 * @param {number[]} nums
 * @return {number}
 */
 export default function lis(nums) {
  const list = new Array(nums.length).fill(1);
  const lisList = [];
  let max = 1;

  for (let i = 0; i < nums.length; i++) {
      let currentOpsMax = list[i];
      for (let j = i; j >= 0; j--) {
          const sum = list[i] + list[j];
          if (nums[i] > nums[j] && sum > currentOpsMax) {
              currentOpsMax = sum;
          }
      }
      list[i] = currentOpsMax;
      if (currentOpsMax > max) {
          max = currentOpsMax;
      }
  }

  for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === max) {
        lisList.unshift(i);
          max--;
      }
  }
  return lisList;
};