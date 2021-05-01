/**
 * This function will help you be certain that you handle all cases in switch case.
 * If one case is not covered typescript will raise an error at compilation time.
 * @category Utility
 * @example
 * ```typescript
 *  if (result.outcome === "FAILURE") {
 *    switch (result.errorCode) {
 *      case "ERROR_1":
 *        return;
 *
 *      case "ERROR_2":
 *        return;
 *
 *      default:
 *
 *        // If you haven't covered all cases this line will generate a Typescript error
 *        // that tells you which case you've missed
 *        missingSwitchCaseHandling(result.errorCode);
 *    }
 *  }
 * ```
 */

/* istanbul ignore next */
export function missingSwitchCaseHandling(x: never): never {
  throw new Error(`Non-exhaustive match: case ${x} was not handled.`);
}
