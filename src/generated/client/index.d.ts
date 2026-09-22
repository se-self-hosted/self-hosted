
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model MeetingRoom
 * 
 */
export type MeetingRoom = $Result.DefaultSelection<Prisma.$MeetingRoomPayload>
/**
 * Model Meeting
 * 
 */
export type Meeting = $Result.DefaultSelection<Prisma.$MeetingPayload>
/**
 * Model Participant
 * 
 */
export type Participant = $Result.DefaultSelection<Prisma.$ParticipantPayload>
/**
 * Model ParticipantSession
 * 
 */
export type ParticipantSession = $Result.DefaultSelection<Prisma.$ParticipantSessionPayload>
/**
 * Model Transcript
 * 
 */
export type Transcript = $Result.DefaultSelection<Prisma.$TranscriptPayload>
/**
 * Model TranscriptSegment
 * 
 */
export type TranscriptSegment = $Result.DefaultSelection<Prisma.$TranscriptSegmentPayload>
/**
 * Model MeetingSummary
 * 
 */
export type MeetingSummary = $Result.DefaultSelection<Prisma.$MeetingSummaryPayload>
/**
 * Model Recording
 * 
 */
export type Recording = $Result.DefaultSelection<Prisma.$RecordingPayload>
/**
 * Model Export
 * 
 */
export type Export = $Result.DefaultSelection<Prisma.$ExportPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meetingRoom`: Exposes CRUD operations for the **MeetingRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeetingRooms
    * const meetingRooms = await prisma.meetingRoom.findMany()
    * ```
    */
  get meetingRoom(): Prisma.MeetingRoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meeting`: Exposes CRUD operations for the **Meeting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Meetings
    * const meetings = await prisma.meeting.findMany()
    * ```
    */
  get meeting(): Prisma.MeetingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participant`: Exposes CRUD operations for the **Participant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Participants
    * const participants = await prisma.participant.findMany()
    * ```
    */
  get participant(): Prisma.ParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participantSession`: Exposes CRUD operations for the **ParticipantSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParticipantSessions
    * const participantSessions = await prisma.participantSession.findMany()
    * ```
    */
  get participantSession(): Prisma.ParticipantSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcript`: Exposes CRUD operations for the **Transcript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transcripts
    * const transcripts = await prisma.transcript.findMany()
    * ```
    */
  get transcript(): Prisma.TranscriptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcriptSegment`: Exposes CRUD operations for the **TranscriptSegment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TranscriptSegments
    * const transcriptSegments = await prisma.transcriptSegment.findMany()
    * ```
    */
  get transcriptSegment(): Prisma.TranscriptSegmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meetingSummary`: Exposes CRUD operations for the **MeetingSummary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeetingSummaries
    * const meetingSummaries = await prisma.meetingSummary.findMany()
    * ```
    */
  get meetingSummary(): Prisma.MeetingSummaryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recording`: Exposes CRUD operations for the **Recording** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recordings
    * const recordings = await prisma.recording.findMany()
    * ```
    */
  get recording(): Prisma.RecordingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.export`: Exposes CRUD operations for the **Export** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exports
    * const exports = await prisma.export.findMany()
    * ```
    */
  get export(): Prisma.ExportDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    MeetingRoom: 'MeetingRoom',
    Meeting: 'Meeting',
    Participant: 'Participant',
    ParticipantSession: 'ParticipantSession',
    Transcript: 'Transcript',
    TranscriptSegment: 'TranscriptSegment',
    MeetingSummary: 'MeetingSummary',
    Recording: 'Recording',
    Export: 'Export'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "meetingRoom" | "meeting" | "participant" | "participantSession" | "transcript" | "transcriptSegment" | "meetingSummary" | "recording" | "export"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      MeetingRoom: {
        payload: Prisma.$MeetingRoomPayload<ExtArgs>
        fields: Prisma.MeetingRoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingRoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingRoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          findFirst: {
            args: Prisma.MeetingRoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingRoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          findMany: {
            args: Prisma.MeetingRoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>[]
          }
          create: {
            args: Prisma.MeetingRoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          createMany: {
            args: Prisma.MeetingRoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingRoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>[]
          }
          delete: {
            args: Prisma.MeetingRoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          update: {
            args: Prisma.MeetingRoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          deleteMany: {
            args: Prisma.MeetingRoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingRoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingRoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>[]
          }
          upsert: {
            args: Prisma.MeetingRoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingRoomPayload>
          }
          aggregate: {
            args: Prisma.MeetingRoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeetingRoom>
          }
          groupBy: {
            args: Prisma.MeetingRoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingRoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingRoomCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingRoomCountAggregateOutputType> | number
          }
        }
      }
      Meeting: {
        payload: Prisma.$MeetingPayload<ExtArgs>
        fields: Prisma.MeetingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          findFirst: {
            args: Prisma.MeetingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          findMany: {
            args: Prisma.MeetingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          create: {
            args: Prisma.MeetingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          createMany: {
            args: Prisma.MeetingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          delete: {
            args: Prisma.MeetingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          update: {
            args: Prisma.MeetingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          deleteMany: {
            args: Prisma.MeetingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          upsert: {
            args: Prisma.MeetingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          aggregate: {
            args: Prisma.MeetingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeeting>
          }
          groupBy: {
            args: Prisma.MeetingGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingCountAggregateOutputType> | number
          }
        }
      }
      Participant: {
        payload: Prisma.$ParticipantPayload<ExtArgs>
        fields: Prisma.ParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findFirst: {
            args: Prisma.ParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findMany: {
            args: Prisma.ParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          create: {
            args: Prisma.ParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          createMany: {
            args: Prisma.ParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          delete: {
            args: Prisma.ParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          update: {
            args: Prisma.ParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          upsert: {
            args: Prisma.ParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          aggregate: {
            args: Prisma.ParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipant>
          }
          groupBy: {
            args: Prisma.ParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantCountAggregateOutputType> | number
          }
        }
      }
      ParticipantSession: {
        payload: Prisma.$ParticipantSessionPayload<ExtArgs>
        fields: Prisma.ParticipantSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          findFirst: {
            args: Prisma.ParticipantSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          findMany: {
            args: Prisma.ParticipantSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          create: {
            args: Prisma.ParticipantSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          createMany: {
            args: Prisma.ParticipantSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipantSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          delete: {
            args: Prisma.ParticipantSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          update: {
            args: Prisma.ParticipantSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParticipantSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          upsert: {
            args: Prisma.ParticipantSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          aggregate: {
            args: Prisma.ParticipantSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipantSession>
          }
          groupBy: {
            args: Prisma.ParticipantSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipantSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantSessionCountAggregateOutputType> | number
          }
        }
      }
      Transcript: {
        payload: Prisma.$TranscriptPayload<ExtArgs>
        fields: Prisma.TranscriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findFirst: {
            args: Prisma.TranscriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findMany: {
            args: Prisma.TranscriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          create: {
            args: Prisma.TranscriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          createMany: {
            args: Prisma.TranscriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          delete: {
            args: Prisma.TranscriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          update: {
            args: Prisma.TranscriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          aggregate: {
            args: Prisma.TranscriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscript>
          }
          groupBy: {
            args: Prisma.TranscriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptCountAggregateOutputType> | number
          }
        }
      }
      TranscriptSegment: {
        payload: Prisma.$TranscriptSegmentPayload<ExtArgs>
        fields: Prisma.TranscriptSegmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptSegmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          findFirst: {
            args: Prisma.TranscriptSegmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptSegmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          findMany: {
            args: Prisma.TranscriptSegmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          create: {
            args: Prisma.TranscriptSegmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          createMany: {
            args: Prisma.TranscriptSegmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptSegmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          delete: {
            args: Prisma.TranscriptSegmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          update: {
            args: Prisma.TranscriptSegmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptSegmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptSegmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptSegmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          aggregate: {
            args: Prisma.TranscriptSegmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscriptSegment>
          }
          groupBy: {
            args: Prisma.TranscriptSegmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptSegmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptSegmentCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptSegmentCountAggregateOutputType> | number
          }
        }
      }
      MeetingSummary: {
        payload: Prisma.$MeetingSummaryPayload<ExtArgs>
        fields: Prisma.MeetingSummaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingSummaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingSummaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          findFirst: {
            args: Prisma.MeetingSummaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingSummaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          findMany: {
            args: Prisma.MeetingSummaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>[]
          }
          create: {
            args: Prisma.MeetingSummaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          createMany: {
            args: Prisma.MeetingSummaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingSummaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>[]
          }
          delete: {
            args: Prisma.MeetingSummaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          update: {
            args: Prisma.MeetingSummaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          deleteMany: {
            args: Prisma.MeetingSummaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingSummaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingSummaryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>[]
          }
          upsert: {
            args: Prisma.MeetingSummaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingSummaryPayload>
          }
          aggregate: {
            args: Prisma.MeetingSummaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeetingSummary>
          }
          groupBy: {
            args: Prisma.MeetingSummaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingSummaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingSummaryCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingSummaryCountAggregateOutputType> | number
          }
        }
      }
      Recording: {
        payload: Prisma.$RecordingPayload<ExtArgs>
        fields: Prisma.RecordingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecordingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecordingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          findFirst: {
            args: Prisma.RecordingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecordingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          findMany: {
            args: Prisma.RecordingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>[]
          }
          create: {
            args: Prisma.RecordingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          createMany: {
            args: Prisma.RecordingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecordingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>[]
          }
          delete: {
            args: Prisma.RecordingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          update: {
            args: Prisma.RecordingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          deleteMany: {
            args: Prisma.RecordingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecordingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecordingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>[]
          }
          upsert: {
            args: Prisma.RecordingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordingPayload>
          }
          aggregate: {
            args: Prisma.RecordingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecording>
          }
          groupBy: {
            args: Prisma.RecordingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecordingGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecordingCountArgs<ExtArgs>
            result: $Utils.Optional<RecordingCountAggregateOutputType> | number
          }
        }
      }
      Export: {
        payload: Prisma.$ExportPayload<ExtArgs>
        fields: Prisma.ExportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          findFirst: {
            args: Prisma.ExportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          findMany: {
            args: Prisma.ExportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>[]
          }
          create: {
            args: Prisma.ExportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          createMany: {
            args: Prisma.ExportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>[]
          }
          delete: {
            args: Prisma.ExportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          update: {
            args: Prisma.ExportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          deleteMany: {
            args: Prisma.ExportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>[]
          }
          upsert: {
            args: Prisma.ExportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportPayload>
          }
          aggregate: {
            args: Prisma.ExportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExport>
          }
          groupBy: {
            args: Prisma.ExportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExportCountArgs<ExtArgs>
            result: $Utils.Optional<ExportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    meetingRoom?: MeetingRoomOmit
    meeting?: MeetingOmit
    participant?: ParticipantOmit
    participantSession?: ParticipantSessionOmit
    transcript?: TranscriptOmit
    transcriptSegment?: TranscriptSegmentOmit
    meetingSummary?: MeetingSummaryOmit
    recording?: RecordingOmit
    export?: ExportOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    rooms: number
    participants: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rooms?: boolean | UserCountOutputTypeCountRoomsArgs
    participants?: boolean | UserCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingRoomWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }


  /**
   * Count Type MeetingRoomCountOutputType
   */

  export type MeetingRoomCountOutputType = {
    meetings: number
  }

  export type MeetingRoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | MeetingRoomCountOutputTypeCountMeetingsArgs
  }

  // Custom InputTypes
  /**
   * MeetingRoomCountOutputType without action
   */
  export type MeetingRoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoomCountOutputType
     */
    select?: MeetingRoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeetingRoomCountOutputType without action
   */
  export type MeetingRoomCountOutputTypeCountMeetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingWhereInput
  }


  /**
   * Count Type MeetingCountOutputType
   */

  export type MeetingCountOutputType = {
    participants: number
    recordings: number
    exports: number
  }

  export type MeetingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | MeetingCountOutputTypeCountParticipantsArgs
    recordings?: boolean | MeetingCountOutputTypeCountRecordingsArgs
    exports?: boolean | MeetingCountOutputTypeCountExportsArgs
  }

  // Custom InputTypes
  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingCountOutputType
     */
    select?: MeetingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountRecordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecordingWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountExportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportWhereInput
  }


  /**
   * Count Type ParticipantCountOutputType
   */

  export type ParticipantCountOutputType = {
    sessions: number
    segments: number
    recordings: number
  }

  export type ParticipantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ParticipantCountOutputTypeCountSessionsArgs
    segments?: boolean | ParticipantCountOutputTypeCountSegmentsArgs
    recordings?: boolean | ParticipantCountOutputTypeCountRecordingsArgs
  }

  // Custom InputTypes
  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantCountOutputType
     */
    select?: ParticipantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantSessionWhereInput
  }

  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeCountSegmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptSegmentWhereInput
  }

  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeCountRecordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecordingWhereInput
  }


  /**
   * Count Type TranscriptCountOutputType
   */

  export type TranscriptCountOutputType = {
    segments: number
  }

  export type TranscriptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    segments?: boolean | TranscriptCountOutputTypeCountSegmentsArgs
  }

  // Custom InputTypes
  /**
   * TranscriptCountOutputType without action
   */
  export type TranscriptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptCountOutputType
     */
    select?: TranscriptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TranscriptCountOutputType without action
   */
  export type TranscriptCountOutputTypeCountSegmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptSegmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    fullname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    fullname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    fullname: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullname?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    fullname: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rooms?: boolean | User$roomsArgs<ExtArgs>
    participants?: boolean | User$participantsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    fullname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "fullname" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rooms?: boolean | User$roomsArgs<ExtArgs>
    participants?: boolean | User$participantsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      rooms: Prisma.$MeetingRoomPayload<ExtArgs>[]
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      fullname: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rooms<T extends User$roomsArgs<ExtArgs> = {}>(args?: Subset<T, User$roomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    participants<T extends User$participantsArgs<ExtArgs> = {}>(args?: Subset<T, User$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly fullname: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.rooms
   */
  export type User$roomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    where?: MeetingRoomWhereInput
    orderBy?: MeetingRoomOrderByWithRelationInput | MeetingRoomOrderByWithRelationInput[]
    cursor?: MeetingRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingRoomScalarFieldEnum | MeetingRoomScalarFieldEnum[]
  }

  /**
   * User.participants
   */
  export type User$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model MeetingRoom
   */

  export type AggregateMeetingRoom = {
    _count: MeetingRoomCountAggregateOutputType | null
    _avg: MeetingRoomAvgAggregateOutputType | null
    _sum: MeetingRoomSumAggregateOutputType | null
    _min: MeetingRoomMinAggregateOutputType | null
    _max: MeetingRoomMaxAggregateOutputType | null
  }

  export type MeetingRoomAvgAggregateOutputType = {
    maxParticipants: number | null
  }

  export type MeetingRoomSumAggregateOutputType = {
    maxParticipants: number | null
  }

  export type MeetingRoomMinAggregateOutputType = {
    id: string | null
    hostId: string | null
    roomName: string | null
    roomHash: string | null
    maxParticipants: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MeetingRoomMaxAggregateOutputType = {
    id: string | null
    hostId: string | null
    roomName: string | null
    roomHash: string | null
    maxParticipants: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MeetingRoomCountAggregateOutputType = {
    id: number
    hostId: number
    roomName: number
    roomHash: number
    maxParticipants: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MeetingRoomAvgAggregateInputType = {
    maxParticipants?: true
  }

  export type MeetingRoomSumAggregateInputType = {
    maxParticipants?: true
  }

  export type MeetingRoomMinAggregateInputType = {
    id?: true
    hostId?: true
    roomName?: true
    roomHash?: true
    maxParticipants?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MeetingRoomMaxAggregateInputType = {
    id?: true
    hostId?: true
    roomName?: true
    roomHash?: true
    maxParticipants?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MeetingRoomCountAggregateInputType = {
    id?: true
    hostId?: true
    roomName?: true
    roomHash?: true
    maxParticipants?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MeetingRoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingRoom to aggregate.
     */
    where?: MeetingRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingRooms to fetch.
     */
    orderBy?: MeetingRoomOrderByWithRelationInput | MeetingRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeetingRooms
    **/
    _count?: true | MeetingRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MeetingRoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MeetingRoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingRoomMaxAggregateInputType
  }

  export type GetMeetingRoomAggregateType<T extends MeetingRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateMeetingRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeetingRoom[P]>
      : GetScalarType<T[P], AggregateMeetingRoom[P]>
  }




  export type MeetingRoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingRoomWhereInput
    orderBy?: MeetingRoomOrderByWithAggregationInput | MeetingRoomOrderByWithAggregationInput[]
    by: MeetingRoomScalarFieldEnum[] | MeetingRoomScalarFieldEnum
    having?: MeetingRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingRoomCountAggregateInputType | true
    _avg?: MeetingRoomAvgAggregateInputType
    _sum?: MeetingRoomSumAggregateInputType
    _min?: MeetingRoomMinAggregateInputType
    _max?: MeetingRoomMaxAggregateInputType
  }

  export type MeetingRoomGroupByOutputType = {
    id: string
    hostId: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt: Date
    updatedAt: Date
    _count: MeetingRoomCountAggregateOutputType | null
    _avg: MeetingRoomAvgAggregateOutputType | null
    _sum: MeetingRoomSumAggregateOutputType | null
    _min: MeetingRoomMinAggregateOutputType | null
    _max: MeetingRoomMaxAggregateOutputType | null
  }

  type GetMeetingRoomGroupByPayload<T extends MeetingRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingRoomGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingRoomGroupByOutputType[P]>
        }
      >
    >


  export type MeetingRoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hostId?: boolean
    roomName?: boolean
    roomHash?: boolean
    maxParticipants?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    host?: boolean | UserDefaultArgs<ExtArgs>
    meetings?: boolean | MeetingRoom$meetingsArgs<ExtArgs>
    _count?: boolean | MeetingRoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingRoom"]>

  export type MeetingRoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hostId?: boolean
    roomName?: boolean
    roomHash?: boolean
    maxParticipants?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    host?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingRoom"]>

  export type MeetingRoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hostId?: boolean
    roomName?: boolean
    roomHash?: boolean
    maxParticipants?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    host?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingRoom"]>

  export type MeetingRoomSelectScalar = {
    id?: boolean
    hostId?: boolean
    roomName?: boolean
    roomHash?: boolean
    maxParticipants?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MeetingRoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "hostId" | "roomName" | "roomHash" | "maxParticipants" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["meetingRoom"]>
  export type MeetingRoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | UserDefaultArgs<ExtArgs>
    meetings?: boolean | MeetingRoom$meetingsArgs<ExtArgs>
    _count?: boolean | MeetingRoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MeetingRoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MeetingRoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MeetingRoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeetingRoom"
    objects: {
      host: Prisma.$UserPayload<ExtArgs>
      meetings: Prisma.$MeetingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hostId: string
      roomName: string
      roomHash: string
      maxParticipants: number
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["meetingRoom"]>
    composites: {}
  }

  type MeetingRoomGetPayload<S extends boolean | null | undefined | MeetingRoomDefaultArgs> = $Result.GetResult<Prisma.$MeetingRoomPayload, S>

  type MeetingRoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingRoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingRoomCountAggregateInputType | true
    }

  export interface MeetingRoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeetingRoom'], meta: { name: 'MeetingRoom' } }
    /**
     * Find zero or one MeetingRoom that matches the filter.
     * @param {MeetingRoomFindUniqueArgs} args - Arguments to find a MeetingRoom
     * @example
     * // Get one MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingRoomFindUniqueArgs>(args: SelectSubset<T, MeetingRoomFindUniqueArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeetingRoom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingRoomFindUniqueOrThrowArgs} args - Arguments to find a MeetingRoom
     * @example
     * // Get one MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingRoomFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingRoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomFindFirstArgs} args - Arguments to find a MeetingRoom
     * @example
     * // Get one MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingRoomFindFirstArgs>(args?: SelectSubset<T, MeetingRoomFindFirstArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingRoom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomFindFirstOrThrowArgs} args - Arguments to find a MeetingRoom
     * @example
     * // Get one MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingRoomFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingRoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeetingRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeetingRooms
     * const meetingRooms = await prisma.meetingRoom.findMany()
     * 
     * // Get first 10 MeetingRooms
     * const meetingRooms = await prisma.meetingRoom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingRoomWithIdOnly = await prisma.meetingRoom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingRoomFindManyArgs>(args?: SelectSubset<T, MeetingRoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeetingRoom.
     * @param {MeetingRoomCreateArgs} args - Arguments to create a MeetingRoom.
     * @example
     * // Create one MeetingRoom
     * const MeetingRoom = await prisma.meetingRoom.create({
     *   data: {
     *     // ... data to create a MeetingRoom
     *   }
     * })
     * 
     */
    create<T extends MeetingRoomCreateArgs>(args: SelectSubset<T, MeetingRoomCreateArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeetingRooms.
     * @param {MeetingRoomCreateManyArgs} args - Arguments to create many MeetingRooms.
     * @example
     * // Create many MeetingRooms
     * const meetingRoom = await prisma.meetingRoom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingRoomCreateManyArgs>(args?: SelectSubset<T, MeetingRoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeetingRooms and returns the data saved in the database.
     * @param {MeetingRoomCreateManyAndReturnArgs} args - Arguments to create many MeetingRooms.
     * @example
     * // Create many MeetingRooms
     * const meetingRoom = await prisma.meetingRoom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeetingRooms and only return the `id`
     * const meetingRoomWithIdOnly = await prisma.meetingRoom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingRoomCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingRoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeetingRoom.
     * @param {MeetingRoomDeleteArgs} args - Arguments to delete one MeetingRoom.
     * @example
     * // Delete one MeetingRoom
     * const MeetingRoom = await prisma.meetingRoom.delete({
     *   where: {
     *     // ... filter to delete one MeetingRoom
     *   }
     * })
     * 
     */
    delete<T extends MeetingRoomDeleteArgs>(args: SelectSubset<T, MeetingRoomDeleteArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeetingRoom.
     * @param {MeetingRoomUpdateArgs} args - Arguments to update one MeetingRoom.
     * @example
     * // Update one MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingRoomUpdateArgs>(args: SelectSubset<T, MeetingRoomUpdateArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeetingRooms.
     * @param {MeetingRoomDeleteManyArgs} args - Arguments to filter MeetingRooms to delete.
     * @example
     * // Delete a few MeetingRooms
     * const { count } = await prisma.meetingRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingRoomDeleteManyArgs>(args?: SelectSubset<T, MeetingRoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeetingRooms
     * const meetingRoom = await prisma.meetingRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingRoomUpdateManyArgs>(args: SelectSubset<T, MeetingRoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingRooms and returns the data updated in the database.
     * @param {MeetingRoomUpdateManyAndReturnArgs} args - Arguments to update many MeetingRooms.
     * @example
     * // Update many MeetingRooms
     * const meetingRoom = await prisma.meetingRoom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeetingRooms and only return the `id`
     * const meetingRoomWithIdOnly = await prisma.meetingRoom.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MeetingRoomUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingRoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeetingRoom.
     * @param {MeetingRoomUpsertArgs} args - Arguments to update or create a MeetingRoom.
     * @example
     * // Update or create a MeetingRoom
     * const meetingRoom = await prisma.meetingRoom.upsert({
     *   create: {
     *     // ... data to create a MeetingRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeetingRoom we want to update
     *   }
     * })
     */
    upsert<T extends MeetingRoomUpsertArgs>(args: SelectSubset<T, MeetingRoomUpsertArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeetingRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomCountArgs} args - Arguments to filter MeetingRooms to count.
     * @example
     * // Count the number of MeetingRooms
     * const count = await prisma.meetingRoom.count({
     *   where: {
     *     // ... the filter for the MeetingRooms we want to count
     *   }
     * })
    **/
    count<T extends MeetingRoomCountArgs>(
      args?: Subset<T, MeetingRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeetingRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MeetingRoomAggregateArgs>(args: Subset<T, MeetingRoomAggregateArgs>): Prisma.PrismaPromise<GetMeetingRoomAggregateType<T>>

    /**
     * Group by MeetingRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingRoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MeetingRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingRoomGroupByArgs['orderBy'] }
        : { orderBy?: MeetingRoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MeetingRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeetingRoom model
   */
  readonly fields: MeetingRoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeetingRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingRoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    host<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    meetings<T extends MeetingRoom$meetingsArgs<ExtArgs> = {}>(args?: Subset<T, MeetingRoom$meetingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MeetingRoom model
   */
  interface MeetingRoomFieldRefs {
    readonly id: FieldRef<"MeetingRoom", 'String'>
    readonly hostId: FieldRef<"MeetingRoom", 'String'>
    readonly roomName: FieldRef<"MeetingRoom", 'String'>
    readonly roomHash: FieldRef<"MeetingRoom", 'String'>
    readonly maxParticipants: FieldRef<"MeetingRoom", 'Int'>
    readonly status: FieldRef<"MeetingRoom", 'String'>
    readonly createdAt: FieldRef<"MeetingRoom", 'DateTime'>
    readonly updatedAt: FieldRef<"MeetingRoom", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MeetingRoom findUnique
   */
  export type MeetingRoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter, which MeetingRoom to fetch.
     */
    where: MeetingRoomWhereUniqueInput
  }

  /**
   * MeetingRoom findUniqueOrThrow
   */
  export type MeetingRoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter, which MeetingRoom to fetch.
     */
    where: MeetingRoomWhereUniqueInput
  }

  /**
   * MeetingRoom findFirst
   */
  export type MeetingRoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter, which MeetingRoom to fetch.
     */
    where?: MeetingRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingRooms to fetch.
     */
    orderBy?: MeetingRoomOrderByWithRelationInput | MeetingRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingRooms.
     */
    cursor?: MeetingRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingRooms.
     */
    distinct?: MeetingRoomScalarFieldEnum | MeetingRoomScalarFieldEnum[]
  }

  /**
   * MeetingRoom findFirstOrThrow
   */
  export type MeetingRoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter, which MeetingRoom to fetch.
     */
    where?: MeetingRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingRooms to fetch.
     */
    orderBy?: MeetingRoomOrderByWithRelationInput | MeetingRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingRooms.
     */
    cursor?: MeetingRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingRooms.
     */
    distinct?: MeetingRoomScalarFieldEnum | MeetingRoomScalarFieldEnum[]
  }

  /**
   * MeetingRoom findMany
   */
  export type MeetingRoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter, which MeetingRooms to fetch.
     */
    where?: MeetingRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingRooms to fetch.
     */
    orderBy?: MeetingRoomOrderByWithRelationInput | MeetingRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeetingRooms.
     */
    cursor?: MeetingRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingRooms.
     */
    distinct?: MeetingRoomScalarFieldEnum | MeetingRoomScalarFieldEnum[]
  }

  /**
   * MeetingRoom create
   */
  export type MeetingRoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * The data needed to create a MeetingRoom.
     */
    data: XOR<MeetingRoomCreateInput, MeetingRoomUncheckedCreateInput>
  }

  /**
   * MeetingRoom createMany
   */
  export type MeetingRoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeetingRooms.
     */
    data: MeetingRoomCreateManyInput | MeetingRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeetingRoom createManyAndReturn
   */
  export type MeetingRoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * The data used to create many MeetingRooms.
     */
    data: MeetingRoomCreateManyInput | MeetingRoomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingRoom update
   */
  export type MeetingRoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * The data needed to update a MeetingRoom.
     */
    data: XOR<MeetingRoomUpdateInput, MeetingRoomUncheckedUpdateInput>
    /**
     * Choose, which MeetingRoom to update.
     */
    where: MeetingRoomWhereUniqueInput
  }

  /**
   * MeetingRoom updateMany
   */
  export type MeetingRoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeetingRooms.
     */
    data: XOR<MeetingRoomUpdateManyMutationInput, MeetingRoomUncheckedUpdateManyInput>
    /**
     * Filter which MeetingRooms to update
     */
    where?: MeetingRoomWhereInput
    /**
     * Limit how many MeetingRooms to update.
     */
    limit?: number
  }

  /**
   * MeetingRoom updateManyAndReturn
   */
  export type MeetingRoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * The data used to update MeetingRooms.
     */
    data: XOR<MeetingRoomUpdateManyMutationInput, MeetingRoomUncheckedUpdateManyInput>
    /**
     * Filter which MeetingRooms to update
     */
    where?: MeetingRoomWhereInput
    /**
     * Limit how many MeetingRooms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingRoom upsert
   */
  export type MeetingRoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * The filter to search for the MeetingRoom to update in case it exists.
     */
    where: MeetingRoomWhereUniqueInput
    /**
     * In case the MeetingRoom found by the `where` argument doesn't exist, create a new MeetingRoom with this data.
     */
    create: XOR<MeetingRoomCreateInput, MeetingRoomUncheckedCreateInput>
    /**
     * In case the MeetingRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingRoomUpdateInput, MeetingRoomUncheckedUpdateInput>
  }

  /**
   * MeetingRoom delete
   */
  export type MeetingRoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
    /**
     * Filter which MeetingRoom to delete.
     */
    where: MeetingRoomWhereUniqueInput
  }

  /**
   * MeetingRoom deleteMany
   */
  export type MeetingRoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingRooms to delete
     */
    where?: MeetingRoomWhereInput
    /**
     * Limit how many MeetingRooms to delete.
     */
    limit?: number
  }

  /**
   * MeetingRoom.meetings
   */
  export type MeetingRoom$meetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    where?: MeetingWhereInput
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    cursor?: MeetingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * MeetingRoom without action
   */
  export type MeetingRoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingRoom
     */
    select?: MeetingRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingRoom
     */
    omit?: MeetingRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingRoomInclude<ExtArgs> | null
  }


  /**
   * Model Meeting
   */

  export type AggregateMeeting = {
    _count: MeetingCountAggregateOutputType | null
    _avg: MeetingAvgAggregateOutputType | null
    _sum: MeetingSumAggregateOutputType | null
    _min: MeetingMinAggregateOutputType | null
    _max: MeetingMaxAggregateOutputType | null
  }

  export type MeetingAvgAggregateOutputType = {
    durationSeconds: number | null
  }

  export type MeetingSumAggregateOutputType = {
    durationSeconds: number | null
  }

  export type MeetingMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    createdAt: Date | null
  }

  export type MeetingMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    createdAt: Date | null
  }

  export type MeetingCountAggregateOutputType = {
    id: number
    roomId: number
    startedAt: number
    endedAt: number
    durationSeconds: number
    createdAt: number
    _all: number
  }


  export type MeetingAvgAggregateInputType = {
    durationSeconds?: true
  }

  export type MeetingSumAggregateInputType = {
    durationSeconds?: true
  }

  export type MeetingMinAggregateInputType = {
    id?: true
    roomId?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
  }

  export type MeetingMaxAggregateInputType = {
    id?: true
    roomId?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
  }

  export type MeetingCountAggregateInputType = {
    id?: true
    roomId?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
    _all?: true
  }

  export type MeetingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Meeting to aggregate.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Meetings
    **/
    _count?: true | MeetingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MeetingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MeetingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingMaxAggregateInputType
  }

  export type GetMeetingAggregateType<T extends MeetingAggregateArgs> = {
        [P in keyof T & keyof AggregateMeeting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeeting[P]>
      : GetScalarType<T[P], AggregateMeeting[P]>
  }




  export type MeetingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingWhereInput
    orderBy?: MeetingOrderByWithAggregationInput | MeetingOrderByWithAggregationInput[]
    by: MeetingScalarFieldEnum[] | MeetingScalarFieldEnum
    having?: MeetingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingCountAggregateInputType | true
    _avg?: MeetingAvgAggregateInputType
    _sum?: MeetingSumAggregateInputType
    _min?: MeetingMinAggregateInputType
    _max?: MeetingMaxAggregateInputType
  }

  export type MeetingGroupByOutputType = {
    id: string
    roomId: string
    startedAt: Date
    endedAt: Date | null
    durationSeconds: number | null
    createdAt: Date
    _count: MeetingCountAggregateOutputType | null
    _avg: MeetingAvgAggregateOutputType | null
    _sum: MeetingSumAggregateOutputType | null
    _min: MeetingMinAggregateOutputType | null
    _max: MeetingMaxAggregateOutputType | null
  }

  type GetMeetingGroupByPayload<T extends MeetingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingGroupByOutputType[P]>
        }
      >
    >


  export type MeetingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
    participants?: boolean | Meeting$participantsArgs<ExtArgs>
    transcript?: boolean | Meeting$transcriptArgs<ExtArgs>
    summary?: boolean | Meeting$summaryArgs<ExtArgs>
    recordings?: boolean | Meeting$recordingsArgs<ExtArgs>
    exports?: boolean | Meeting$exportsArgs<ExtArgs>
    _count?: boolean | MeetingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectScalar = {
    id?: boolean
    roomId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
  }

  export type MeetingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "startedAt" | "endedAt" | "durationSeconds" | "createdAt", ExtArgs["result"]["meeting"]>
  export type MeetingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
    participants?: boolean | Meeting$participantsArgs<ExtArgs>
    transcript?: boolean | Meeting$transcriptArgs<ExtArgs>
    summary?: boolean | Meeting$summaryArgs<ExtArgs>
    recordings?: boolean | Meeting$recordingsArgs<ExtArgs>
    exports?: boolean | Meeting$exportsArgs<ExtArgs>
    _count?: boolean | MeetingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MeetingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
  }
  export type MeetingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MeetingRoomDefaultArgs<ExtArgs>
  }

  export type $MeetingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Meeting"
    objects: {
      room: Prisma.$MeetingRoomPayload<ExtArgs>
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
      transcript: Prisma.$TranscriptPayload<ExtArgs> | null
      summary: Prisma.$MeetingSummaryPayload<ExtArgs> | null
      recordings: Prisma.$RecordingPayload<ExtArgs>[]
      exports: Prisma.$ExportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string
      startedAt: Date
      endedAt: Date | null
      durationSeconds: number | null
      createdAt: Date
    }, ExtArgs["result"]["meeting"]>
    composites: {}
  }

  type MeetingGetPayload<S extends boolean | null | undefined | MeetingDefaultArgs> = $Result.GetResult<Prisma.$MeetingPayload, S>

  type MeetingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingCountAggregateInputType | true
    }

  export interface MeetingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Meeting'], meta: { name: 'Meeting' } }
    /**
     * Find zero or one Meeting that matches the filter.
     * @param {MeetingFindUniqueArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingFindUniqueArgs>(args: SelectSubset<T, MeetingFindUniqueArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Meeting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingFindUniqueOrThrowArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meeting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindFirstArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingFindFirstArgs>(args?: SelectSubset<T, MeetingFindFirstArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meeting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindFirstOrThrowArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Meetings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Meetings
     * const meetings = await prisma.meeting.findMany()
     * 
     * // Get first 10 Meetings
     * const meetings = await prisma.meeting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingWithIdOnly = await prisma.meeting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingFindManyArgs>(args?: SelectSubset<T, MeetingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Meeting.
     * @param {MeetingCreateArgs} args - Arguments to create a Meeting.
     * @example
     * // Create one Meeting
     * const Meeting = await prisma.meeting.create({
     *   data: {
     *     // ... data to create a Meeting
     *   }
     * })
     * 
     */
    create<T extends MeetingCreateArgs>(args: SelectSubset<T, MeetingCreateArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Meetings.
     * @param {MeetingCreateManyArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meeting = await prisma.meeting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingCreateManyArgs>(args?: SelectSubset<T, MeetingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Meetings and returns the data saved in the database.
     * @param {MeetingCreateManyAndReturnArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meeting = await prisma.meeting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Meetings and only return the `id`
     * const meetingWithIdOnly = await prisma.meeting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Meeting.
     * @param {MeetingDeleteArgs} args - Arguments to delete one Meeting.
     * @example
     * // Delete one Meeting
     * const Meeting = await prisma.meeting.delete({
     *   where: {
     *     // ... filter to delete one Meeting
     *   }
     * })
     * 
     */
    delete<T extends MeetingDeleteArgs>(args: SelectSubset<T, MeetingDeleteArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Meeting.
     * @param {MeetingUpdateArgs} args - Arguments to update one Meeting.
     * @example
     * // Update one Meeting
     * const meeting = await prisma.meeting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingUpdateArgs>(args: SelectSubset<T, MeetingUpdateArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Meetings.
     * @param {MeetingDeleteManyArgs} args - Arguments to filter Meetings to delete.
     * @example
     * // Delete a few Meetings
     * const { count } = await prisma.meeting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingDeleteManyArgs>(args?: SelectSubset<T, MeetingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Meetings
     * const meeting = await prisma.meeting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingUpdateManyArgs>(args: SelectSubset<T, MeetingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings and returns the data updated in the database.
     * @param {MeetingUpdateManyAndReturnArgs} args - Arguments to update many Meetings.
     * @example
     * // Update many Meetings
     * const meeting = await prisma.meeting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Meetings and only return the `id`
     * const meetingWithIdOnly = await prisma.meeting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MeetingUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Meeting.
     * @param {MeetingUpsertArgs} args - Arguments to update or create a Meeting.
     * @example
     * // Update or create a Meeting
     * const meeting = await prisma.meeting.upsert({
     *   create: {
     *     // ... data to create a Meeting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Meeting we want to update
     *   }
     * })
     */
    upsert<T extends MeetingUpsertArgs>(args: SelectSubset<T, MeetingUpsertArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingCountArgs} args - Arguments to filter Meetings to count.
     * @example
     * // Count the number of Meetings
     * const count = await prisma.meeting.count({
     *   where: {
     *     // ... the filter for the Meetings we want to count
     *   }
     * })
    **/
    count<T extends MeetingCountArgs>(
      args?: Subset<T, MeetingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Meeting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MeetingAggregateArgs>(args: Subset<T, MeetingAggregateArgs>): Prisma.PrismaPromise<GetMeetingAggregateType<T>>

    /**
     * Group by Meeting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MeetingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingGroupByArgs['orderBy'] }
        : { orderBy?: MeetingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MeetingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Meeting model
   */
  readonly fields: MeetingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Meeting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends MeetingRoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingRoomDefaultArgs<ExtArgs>>): Prisma__MeetingRoomClient<$Result.GetResult<Prisma.$MeetingRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends Meeting$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transcript<T extends Meeting$transcriptArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$transcriptArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    summary<T extends Meeting$summaryArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$summaryArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    recordings<T extends Meeting$recordingsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$recordingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exports<T extends Meeting$exportsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$exportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Meeting model
   */
  interface MeetingFieldRefs {
    readonly id: FieldRef<"Meeting", 'String'>
    readonly roomId: FieldRef<"Meeting", 'String'>
    readonly startedAt: FieldRef<"Meeting", 'DateTime'>
    readonly endedAt: FieldRef<"Meeting", 'DateTime'>
    readonly durationSeconds: FieldRef<"Meeting", 'Int'>
    readonly createdAt: FieldRef<"Meeting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Meeting findUnique
   */
  export type MeetingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting findUniqueOrThrow
   */
  export type MeetingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting findFirst
   */
  export type MeetingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting findFirstOrThrow
   */
  export type MeetingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting findMany
   */
  export type MeetingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meetings to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting create
   */
  export type MeetingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The data needed to create a Meeting.
     */
    data: XOR<MeetingCreateInput, MeetingUncheckedCreateInput>
  }

  /**
   * Meeting createMany
   */
  export type MeetingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Meetings.
     */
    data: MeetingCreateManyInput | MeetingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Meeting createManyAndReturn
   */
  export type MeetingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * The data used to create many Meetings.
     */
    data: MeetingCreateManyInput | MeetingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Meeting update
   */
  export type MeetingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The data needed to update a Meeting.
     */
    data: XOR<MeetingUpdateInput, MeetingUncheckedUpdateInput>
    /**
     * Choose, which Meeting to update.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting updateMany
   */
  export type MeetingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Meetings.
     */
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyInput>
    /**
     * Filter which Meetings to update
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to update.
     */
    limit?: number
  }

  /**
   * Meeting updateManyAndReturn
   */
  export type MeetingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * The data used to update Meetings.
     */
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyInput>
    /**
     * Filter which Meetings to update
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Meeting upsert
   */
  export type MeetingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The filter to search for the Meeting to update in case it exists.
     */
    where: MeetingWhereUniqueInput
    /**
     * In case the Meeting found by the `where` argument doesn't exist, create a new Meeting with this data.
     */
    create: XOR<MeetingCreateInput, MeetingUncheckedCreateInput>
    /**
     * In case the Meeting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingUpdateInput, MeetingUncheckedUpdateInput>
  }

  /**
   * Meeting delete
   */
  export type MeetingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter which Meeting to delete.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting deleteMany
   */
  export type MeetingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Meetings to delete
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to delete.
     */
    limit?: number
  }

  /**
   * Meeting.participants
   */
  export type Meeting$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Meeting.transcript
   */
  export type Meeting$transcriptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    where?: TranscriptWhereInput
  }

  /**
   * Meeting.summary
   */
  export type Meeting$summaryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    where?: MeetingSummaryWhereInput
  }

  /**
   * Meeting.recordings
   */
  export type Meeting$recordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    where?: RecordingWhereInput
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    cursor?: RecordingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecordingScalarFieldEnum | RecordingScalarFieldEnum[]
  }

  /**
   * Meeting.exports
   */
  export type Meeting$exportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    where?: ExportWhereInput
    orderBy?: ExportOrderByWithRelationInput | ExportOrderByWithRelationInput[]
    cursor?: ExportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExportScalarFieldEnum | ExportScalarFieldEnum[]
  }

  /**
   * Meeting without action
   */
  export type MeetingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
  }


  /**
   * Model Participant
   */

  export type AggregateParticipant = {
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  export type ParticipantMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    userId: string | null
    displayName: string | null
    createdAt: Date | null
  }

  export type ParticipantMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    userId: string | null
    displayName: string | null
    createdAt: Date | null
  }

  export type ParticipantCountAggregateOutputType = {
    id: number
    meetingId: number
    userId: number
    displayName: number
    createdAt: number
    _all: number
  }


  export type ParticipantMinAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    displayName?: true
    createdAt?: true
  }

  export type ParticipantMaxAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    displayName?: true
    createdAt?: true
  }

  export type ParticipantCountAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    displayName?: true
    createdAt?: true
    _all?: true
  }

  export type ParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participant to aggregate.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Participants
    **/
    _count?: true | ParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantMaxAggregateInputType
  }

  export type GetParticipantAggregateType<T extends ParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipant[P]>
      : GetScalarType<T[P], AggregateParticipant[P]>
  }




  export type ParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithAggregationInput | ParticipantOrderByWithAggregationInput[]
    by: ParticipantScalarFieldEnum[] | ParticipantScalarFieldEnum
    having?: ParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantCountAggregateInputType | true
    _min?: ParticipantMinAggregateInputType
    _max?: ParticipantMaxAggregateInputType
  }

  export type ParticipantGroupByOutputType = {
    id: string
    meetingId: string
    userId: string | null
    displayName: string
    createdAt: Date
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  type GetParticipantGroupByPayload<T extends ParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
    sessions?: boolean | Participant$sessionsArgs<ExtArgs>
    segments?: boolean | Participant$segmentsArgs<ExtArgs>
    recordings?: boolean | Participant$recordingsArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectScalar = {
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
  }

  export type ParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "userId" | "displayName" | "createdAt", ExtArgs["result"]["participant"]>
  export type ParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
    sessions?: boolean | Participant$sessionsArgs<ExtArgs>
    segments?: boolean | Participant$segmentsArgs<ExtArgs>
    recordings?: boolean | Participant$recordingsArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
  }
  export type ParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    user?: boolean | Participant$userArgs<ExtArgs>
  }

  export type $ParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Participant"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
      sessions: Prisma.$ParticipantSessionPayload<ExtArgs>[]
      segments: Prisma.$TranscriptSegmentPayload<ExtArgs>[]
      recordings: Prisma.$RecordingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      userId: string | null
      displayName: string
      createdAt: Date
    }, ExtArgs["result"]["participant"]>
    composites: {}
  }

  type ParticipantGetPayload<S extends boolean | null | undefined | ParticipantDefaultArgs> = $Result.GetResult<Prisma.$ParticipantPayload, S>

  type ParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipantCountAggregateInputType | true
    }

  export interface ParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Participant'], meta: { name: 'Participant' } }
    /**
     * Find zero or one Participant that matches the filter.
     * @param {ParticipantFindUniqueArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantFindUniqueArgs>(args: SelectSubset<T, ParticipantFindUniqueArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Participant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipantFindUniqueOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantFindFirstArgs>(args?: SelectSubset<T, ParticipantFindFirstArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Participants
     * const participants = await prisma.participant.findMany()
     * 
     * // Get first 10 Participants
     * const participants = await prisma.participant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantWithIdOnly = await prisma.participant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantFindManyArgs>(args?: SelectSubset<T, ParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Participant.
     * @param {ParticipantCreateArgs} args - Arguments to create a Participant.
     * @example
     * // Create one Participant
     * const Participant = await prisma.participant.create({
     *   data: {
     *     // ... data to create a Participant
     *   }
     * })
     * 
     */
    create<T extends ParticipantCreateArgs>(args: SelectSubset<T, ParticipantCreateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Participants.
     * @param {ParticipantCreateManyArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantCreateManyArgs>(args?: SelectSubset<T, ParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Participants and returns the data saved in the database.
     * @param {ParticipantCreateManyAndReturnArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Participants and only return the `id`
     * const participantWithIdOnly = await prisma.participant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Participant.
     * @param {ParticipantDeleteArgs} args - Arguments to delete one Participant.
     * @example
     * // Delete one Participant
     * const Participant = await prisma.participant.delete({
     *   where: {
     *     // ... filter to delete one Participant
     *   }
     * })
     * 
     */
    delete<T extends ParticipantDeleteArgs>(args: SelectSubset<T, ParticipantDeleteArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Participant.
     * @param {ParticipantUpdateArgs} args - Arguments to update one Participant.
     * @example
     * // Update one Participant
     * const participant = await prisma.participant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantUpdateArgs>(args: SelectSubset<T, ParticipantUpdateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Participants.
     * @param {ParticipantDeleteManyArgs} args - Arguments to filter Participants to delete.
     * @example
     * // Delete a few Participants
     * const { count } = await prisma.participant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantDeleteManyArgs>(args?: SelectSubset<T, ParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantUpdateManyArgs>(args: SelectSubset<T, ParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants and returns the data updated in the database.
     * @param {ParticipantUpdateManyAndReturnArgs} args - Arguments to update many Participants.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Participants and only return the `id`
     * const participantWithIdOnly = await prisma.participant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, ParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Participant.
     * @param {ParticipantUpsertArgs} args - Arguments to update or create a Participant.
     * @example
     * // Update or create a Participant
     * const participant = await prisma.participant.upsert({
     *   create: {
     *     // ... data to create a Participant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Participant we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantUpsertArgs>(args: SelectSubset<T, ParticipantUpsertArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantCountArgs} args - Arguments to filter Participants to count.
     * @example
     * // Count the number of Participants
     * const count = await prisma.participant.count({
     *   where: {
     *     // ... the filter for the Participants we want to count
     *   }
     * })
    **/
    count<T extends ParticipantCountArgs>(
      args?: Subset<T, ParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipantAggregateArgs>(args: Subset<T, ParticipantAggregateArgs>): Prisma.PrismaPromise<GetParticipantAggregateType<T>>

    /**
     * Group by Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Participant model
   */
  readonly fields: ParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Participant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Participant$userArgs<ExtArgs> = {}>(args?: Subset<T, Participant$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sessions<T extends Participant$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Participant$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    segments<T extends Participant$segmentsArgs<ExtArgs> = {}>(args?: Subset<T, Participant$segmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    recordings<T extends Participant$recordingsArgs<ExtArgs> = {}>(args?: Subset<T, Participant$recordingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Participant model
   */
  interface ParticipantFieldRefs {
    readonly id: FieldRef<"Participant", 'String'>
    readonly meetingId: FieldRef<"Participant", 'String'>
    readonly userId: FieldRef<"Participant", 'String'>
    readonly displayName: FieldRef<"Participant", 'String'>
    readonly createdAt: FieldRef<"Participant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Participant findUnique
   */
  export type ParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findUniqueOrThrow
   */
  export type ParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findFirst
   */
  export type ParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findFirstOrThrow
   */
  export type ParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findMany
   */
  export type ParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participants to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant create
   */
  export type ParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a Participant.
     */
    data: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
  }

  /**
   * Participant createMany
   */
  export type ParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Participant createManyAndReturn
   */
  export type ParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Participant update
   */
  export type ParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a Participant.
     */
    data: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
    /**
     * Choose, which Participant to update.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant updateMany
   */
  export type ParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to update.
     */
    limit?: number
  }

  /**
   * Participant updateManyAndReturn
   */
  export type ParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Participant upsert
   */
  export type ParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the Participant to update in case it exists.
     */
    where: ParticipantWhereUniqueInput
    /**
     * In case the Participant found by the `where` argument doesn't exist, create a new Participant with this data.
     */
    create: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
    /**
     * In case the Participant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
  }

  /**
   * Participant delete
   */
  export type ParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter which Participant to delete.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant deleteMany
   */
  export type ParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participants to delete
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to delete.
     */
    limit?: number
  }

  /**
   * Participant.user
   */
  export type Participant$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Participant.sessions
   */
  export type Participant$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    where?: ParticipantSessionWhereInput
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    cursor?: ParticipantSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * Participant.segments
   */
  export type Participant$segmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    where?: TranscriptSegmentWhereInput
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    cursor?: TranscriptSegmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * Participant.recordings
   */
  export type Participant$recordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    where?: RecordingWhereInput
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    cursor?: RecordingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecordingScalarFieldEnum | RecordingScalarFieldEnum[]
  }

  /**
   * Participant without action
   */
  export type ParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
  }


  /**
   * Model ParticipantSession
   */

  export type AggregateParticipantSession = {
    _count: ParticipantSessionCountAggregateOutputType | null
    _avg: ParticipantSessionAvgAggregateOutputType | null
    _sum: ParticipantSessionSumAggregateOutputType | null
    _min: ParticipantSessionMinAggregateOutputType | null
    _max: ParticipantSessionMaxAggregateOutputType | null
  }

  export type ParticipantSessionAvgAggregateOutputType = {
    durationSeconds: number | null
  }

  export type ParticipantSessionSumAggregateOutputType = {
    durationSeconds: number | null
  }

  export type ParticipantSessionMinAggregateOutputType = {
    id: string | null
    participantId: string | null
    joinedAt: Date | null
    lastSeenAt: Date | null
    leftAt: Date | null
    durationSeconds: number | null
    connectionId: string | null
  }

  export type ParticipantSessionMaxAggregateOutputType = {
    id: string | null
    participantId: string | null
    joinedAt: Date | null
    lastSeenAt: Date | null
    leftAt: Date | null
    durationSeconds: number | null
    connectionId: string | null
  }

  export type ParticipantSessionCountAggregateOutputType = {
    id: number
    participantId: number
    joinedAt: number
    lastSeenAt: number
    leftAt: number
    durationSeconds: number
    connectionId: number
    _all: number
  }


  export type ParticipantSessionAvgAggregateInputType = {
    durationSeconds?: true
  }

  export type ParticipantSessionSumAggregateInputType = {
    durationSeconds?: true
  }

  export type ParticipantSessionMinAggregateInputType = {
    id?: true
    participantId?: true
    joinedAt?: true
    lastSeenAt?: true
    leftAt?: true
    durationSeconds?: true
    connectionId?: true
  }

  export type ParticipantSessionMaxAggregateInputType = {
    id?: true
    participantId?: true
    joinedAt?: true
    lastSeenAt?: true
    leftAt?: true
    durationSeconds?: true
    connectionId?: true
  }

  export type ParticipantSessionCountAggregateInputType = {
    id?: true
    participantId?: true
    joinedAt?: true
    lastSeenAt?: true
    leftAt?: true
    durationSeconds?: true
    connectionId?: true
    _all?: true
  }

  export type ParticipantSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipantSession to aggregate.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParticipantSessions
    **/
    _count?: true | ParticipantSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ParticipantSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ParticipantSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantSessionMaxAggregateInputType
  }

  export type GetParticipantSessionAggregateType<T extends ParticipantSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipantSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipantSession[P]>
      : GetScalarType<T[P], AggregateParticipantSession[P]>
  }




  export type ParticipantSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantSessionWhereInput
    orderBy?: ParticipantSessionOrderByWithAggregationInput | ParticipantSessionOrderByWithAggregationInput[]
    by: ParticipantSessionScalarFieldEnum[] | ParticipantSessionScalarFieldEnum
    having?: ParticipantSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantSessionCountAggregateInputType | true
    _avg?: ParticipantSessionAvgAggregateInputType
    _sum?: ParticipantSessionSumAggregateInputType
    _min?: ParticipantSessionMinAggregateInputType
    _max?: ParticipantSessionMaxAggregateInputType
  }

  export type ParticipantSessionGroupByOutputType = {
    id: string
    participantId: string
    joinedAt: Date
    lastSeenAt: Date
    leftAt: Date | null
    durationSeconds: number | null
    connectionId: string
    _count: ParticipantSessionCountAggregateOutputType | null
    _avg: ParticipantSessionAvgAggregateOutputType | null
    _sum: ParticipantSessionSumAggregateOutputType | null
    _min: ParticipantSessionMinAggregateOutputType | null
    _max: ParticipantSessionMaxAggregateOutputType | null
  }

  type GetParticipantSessionGroupByPayload<T extends ParticipantSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantSessionGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    joinedAt?: boolean
    lastSeenAt?: boolean
    leftAt?: boolean
    durationSeconds?: boolean
    connectionId?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    joinedAt?: boolean
    lastSeenAt?: boolean
    leftAt?: boolean
    durationSeconds?: boolean
    connectionId?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    joinedAt?: boolean
    lastSeenAt?: boolean
    leftAt?: boolean
    durationSeconds?: boolean
    connectionId?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectScalar = {
    id?: boolean
    participantId?: boolean
    joinedAt?: boolean
    lastSeenAt?: boolean
    leftAt?: boolean
    durationSeconds?: boolean
    connectionId?: boolean
  }

  export type ParticipantSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "participantId" | "joinedAt" | "lastSeenAt" | "leftAt" | "durationSeconds" | "connectionId", ExtArgs["result"]["participantSession"]>
  export type ParticipantSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type ParticipantSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type ParticipantSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }

  export type $ParticipantSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParticipantSession"
    objects: {
      participant: Prisma.$ParticipantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      participantId: string
      joinedAt: Date
      lastSeenAt: Date
      leftAt: Date | null
      durationSeconds: number | null
      connectionId: string
    }, ExtArgs["result"]["participantSession"]>
    composites: {}
  }

  type ParticipantSessionGetPayload<S extends boolean | null | undefined | ParticipantSessionDefaultArgs> = $Result.GetResult<Prisma.$ParticipantSessionPayload, S>

  type ParticipantSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipantSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipantSessionCountAggregateInputType | true
    }

  export interface ParticipantSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParticipantSession'], meta: { name: 'ParticipantSession' } }
    /**
     * Find zero or one ParticipantSession that matches the filter.
     * @param {ParticipantSessionFindUniqueArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantSessionFindUniqueArgs>(args: SelectSubset<T, ParticipantSessionFindUniqueArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ParticipantSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipantSessionFindUniqueOrThrowArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipantSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindFirstArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantSessionFindFirstArgs>(args?: SelectSubset<T, ParticipantSessionFindFirstArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipantSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindFirstOrThrowArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ParticipantSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParticipantSessions
     * const participantSessions = await prisma.participantSession.findMany()
     * 
     * // Get first 10 ParticipantSessions
     * const participantSessions = await prisma.participantSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantSessionFindManyArgs>(args?: SelectSubset<T, ParticipantSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ParticipantSession.
     * @param {ParticipantSessionCreateArgs} args - Arguments to create a ParticipantSession.
     * @example
     * // Create one ParticipantSession
     * const ParticipantSession = await prisma.participantSession.create({
     *   data: {
     *     // ... data to create a ParticipantSession
     *   }
     * })
     * 
     */
    create<T extends ParticipantSessionCreateArgs>(args: SelectSubset<T, ParticipantSessionCreateArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ParticipantSessions.
     * @param {ParticipantSessionCreateManyArgs} args - Arguments to create many ParticipantSessions.
     * @example
     * // Create many ParticipantSessions
     * const participantSession = await prisma.participantSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantSessionCreateManyArgs>(args?: SelectSubset<T, ParticipantSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParticipantSessions and returns the data saved in the database.
     * @param {ParticipantSessionCreateManyAndReturnArgs} args - Arguments to create many ParticipantSessions.
     * @example
     * // Create many ParticipantSessions
     * const participantSession = await prisma.participantSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParticipantSessions and only return the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipantSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipantSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ParticipantSession.
     * @param {ParticipantSessionDeleteArgs} args - Arguments to delete one ParticipantSession.
     * @example
     * // Delete one ParticipantSession
     * const ParticipantSession = await prisma.participantSession.delete({
     *   where: {
     *     // ... filter to delete one ParticipantSession
     *   }
     * })
     * 
     */
    delete<T extends ParticipantSessionDeleteArgs>(args: SelectSubset<T, ParticipantSessionDeleteArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ParticipantSession.
     * @param {ParticipantSessionUpdateArgs} args - Arguments to update one ParticipantSession.
     * @example
     * // Update one ParticipantSession
     * const participantSession = await prisma.participantSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantSessionUpdateArgs>(args: SelectSubset<T, ParticipantSessionUpdateArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ParticipantSessions.
     * @param {ParticipantSessionDeleteManyArgs} args - Arguments to filter ParticipantSessions to delete.
     * @example
     * // Delete a few ParticipantSessions
     * const { count } = await prisma.participantSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantSessionDeleteManyArgs>(args?: SelectSubset<T, ParticipantSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParticipantSessions
     * const participantSession = await prisma.participantSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantSessionUpdateManyArgs>(args: SelectSubset<T, ParticipantSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipantSessions and returns the data updated in the database.
     * @param {ParticipantSessionUpdateManyAndReturnArgs} args - Arguments to update many ParticipantSessions.
     * @example
     * // Update many ParticipantSessions
     * const participantSession = await prisma.participantSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ParticipantSessions and only return the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParticipantSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ParticipantSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ParticipantSession.
     * @param {ParticipantSessionUpsertArgs} args - Arguments to update or create a ParticipantSession.
     * @example
     * // Update or create a ParticipantSession
     * const participantSession = await prisma.participantSession.upsert({
     *   create: {
     *     // ... data to create a ParticipantSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParticipantSession we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantSessionUpsertArgs>(args: SelectSubset<T, ParticipantSessionUpsertArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ParticipantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionCountArgs} args - Arguments to filter ParticipantSessions to count.
     * @example
     * // Count the number of ParticipantSessions
     * const count = await prisma.participantSession.count({
     *   where: {
     *     // ... the filter for the ParticipantSessions we want to count
     *   }
     * })
    **/
    count<T extends ParticipantSessionCountArgs>(
      args?: Subset<T, ParticipantSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParticipantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipantSessionAggregateArgs>(args: Subset<T, ParticipantSessionAggregateArgs>): Prisma.PrismaPromise<GetParticipantSessionAggregateType<T>>

    /**
     * Group by ParticipantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipantSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantSessionGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipantSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParticipantSession model
   */
  readonly fields: ParticipantSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParticipantSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends ParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ParticipantDefaultArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParticipantSession model
   */
  interface ParticipantSessionFieldRefs {
    readonly id: FieldRef<"ParticipantSession", 'String'>
    readonly participantId: FieldRef<"ParticipantSession", 'String'>
    readonly joinedAt: FieldRef<"ParticipantSession", 'DateTime'>
    readonly lastSeenAt: FieldRef<"ParticipantSession", 'DateTime'>
    readonly leftAt: FieldRef<"ParticipantSession", 'DateTime'>
    readonly durationSeconds: FieldRef<"ParticipantSession", 'Int'>
    readonly connectionId: FieldRef<"ParticipantSession", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ParticipantSession findUnique
   */
  export type ParticipantSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession findUniqueOrThrow
   */
  export type ParticipantSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession findFirst
   */
  export type ParticipantSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession findFirstOrThrow
   */
  export type ParticipantSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession findMany
   */
  export type ParticipantSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter, which ParticipantSessions to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession create
   */
  export type ParticipantSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ParticipantSession.
     */
    data: XOR<ParticipantSessionCreateInput, ParticipantSessionUncheckedCreateInput>
  }

  /**
   * ParticipantSession createMany
   */
  export type ParticipantSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParticipantSessions.
     */
    data: ParticipantSessionCreateManyInput | ParticipantSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParticipantSession createManyAndReturn
   */
  export type ParticipantSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ParticipantSessions.
     */
    data: ParticipantSessionCreateManyInput | ParticipantSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParticipantSession update
   */
  export type ParticipantSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ParticipantSession.
     */
    data: XOR<ParticipantSessionUpdateInput, ParticipantSessionUncheckedUpdateInput>
    /**
     * Choose, which ParticipantSession to update.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession updateMany
   */
  export type ParticipantSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParticipantSessions.
     */
    data: XOR<ParticipantSessionUpdateManyMutationInput, ParticipantSessionUncheckedUpdateManyInput>
    /**
     * Filter which ParticipantSessions to update
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to update.
     */
    limit?: number
  }

  /**
   * ParticipantSession updateManyAndReturn
   */
  export type ParticipantSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data used to update ParticipantSessions.
     */
    data: XOR<ParticipantSessionUpdateManyMutationInput, ParticipantSessionUncheckedUpdateManyInput>
    /**
     * Filter which ParticipantSessions to update
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParticipantSession upsert
   */
  export type ParticipantSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ParticipantSession to update in case it exists.
     */
    where: ParticipantSessionWhereUniqueInput
    /**
     * In case the ParticipantSession found by the `where` argument doesn't exist, create a new ParticipantSession with this data.
     */
    create: XOR<ParticipantSessionCreateInput, ParticipantSessionUncheckedCreateInput>
    /**
     * In case the ParticipantSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantSessionUpdateInput, ParticipantSessionUncheckedUpdateInput>
  }

  /**
   * ParticipantSession delete
   */
  export type ParticipantSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
    /**
     * Filter which ParticipantSession to delete.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession deleteMany
   */
  export type ParticipantSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipantSessions to delete
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to delete.
     */
    limit?: number
  }

  /**
   * ParticipantSession without action
   */
  export type ParticipantSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantSessionInclude<ExtArgs> | null
  }


  /**
   * Model Transcript
   */

  export type AggregateTranscript = {
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  export type TranscriptMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    fullTranscript: string | null
    language: string | null
    createdAt: Date | null
  }

  export type TranscriptMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    fullTranscript: string | null
    language: string | null
    createdAt: Date | null
  }

  export type TranscriptCountAggregateOutputType = {
    id: number
    meetingId: number
    fullTranscript: number
    language: number
    createdAt: number
    _all: number
  }


  export type TranscriptMinAggregateInputType = {
    id?: true
    meetingId?: true
    fullTranscript?: true
    language?: true
    createdAt?: true
  }

  export type TranscriptMaxAggregateInputType = {
    id?: true
    meetingId?: true
    fullTranscript?: true
    language?: true
    createdAt?: true
  }

  export type TranscriptCountAggregateInputType = {
    id?: true
    meetingId?: true
    fullTranscript?: true
    language?: true
    createdAt?: true
    _all?: true
  }

  export type TranscriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcript to aggregate.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transcripts
    **/
    _count?: true | TranscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptMaxAggregateInputType
  }

  export type GetTranscriptAggregateType<T extends TranscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscript[P]>
      : GetScalarType<T[P], AggregateTranscript[P]>
  }




  export type TranscriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithAggregationInput | TranscriptOrderByWithAggregationInput[]
    by: TranscriptScalarFieldEnum[] | TranscriptScalarFieldEnum
    having?: TranscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptCountAggregateInputType | true
    _min?: TranscriptMinAggregateInputType
    _max?: TranscriptMaxAggregateInputType
  }

  export type TranscriptGroupByOutputType = {
    id: string
    meetingId: string
    fullTranscript: string
    language: string
    createdAt: Date
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  type GetTranscriptGroupByPayload<T extends TranscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullTranscript?: boolean
    language?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    segments?: boolean | Transcript$segmentsArgs<ExtArgs>
    _count?: boolean | TranscriptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullTranscript?: boolean
    language?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullTranscript?: boolean
    language?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectScalar = {
    id?: boolean
    meetingId?: boolean
    fullTranscript?: boolean
    language?: boolean
    createdAt?: boolean
  }

  export type TranscriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "fullTranscript" | "language" | "createdAt", ExtArgs["result"]["transcript"]>
  export type TranscriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    segments?: boolean | Transcript$segmentsArgs<ExtArgs>
    _count?: boolean | TranscriptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $TranscriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transcript"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
      segments: Prisma.$TranscriptSegmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      fullTranscript: string
      language: string
      createdAt: Date
    }, ExtArgs["result"]["transcript"]>
    composites: {}
  }

  type TranscriptGetPayload<S extends boolean | null | undefined | TranscriptDefaultArgs> = $Result.GetResult<Prisma.$TranscriptPayload, S>

  type TranscriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptCountAggregateInputType | true
    }

  export interface TranscriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transcript'], meta: { name: 'Transcript' } }
    /**
     * Find zero or one Transcript that matches the filter.
     * @param {TranscriptFindUniqueArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptFindUniqueArgs>(args: SelectSubset<T, TranscriptFindUniqueArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transcript that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptFindUniqueOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptFindFirstArgs>(args?: SelectSubset<T, TranscriptFindFirstArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transcripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transcripts
     * const transcripts = await prisma.transcript.findMany()
     * 
     * // Get first 10 Transcripts
     * const transcripts = await prisma.transcript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptWithIdOnly = await prisma.transcript.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptFindManyArgs>(args?: SelectSubset<T, TranscriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transcript.
     * @param {TranscriptCreateArgs} args - Arguments to create a Transcript.
     * @example
     * // Create one Transcript
     * const Transcript = await prisma.transcript.create({
     *   data: {
     *     // ... data to create a Transcript
     *   }
     * })
     * 
     */
    create<T extends TranscriptCreateArgs>(args: SelectSubset<T, TranscriptCreateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transcripts.
     * @param {TranscriptCreateManyArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptCreateManyArgs>(args?: SelectSubset<T, TranscriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transcripts and returns the data saved in the database.
     * @param {TranscriptCreateManyAndReturnArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transcript.
     * @param {TranscriptDeleteArgs} args - Arguments to delete one Transcript.
     * @example
     * // Delete one Transcript
     * const Transcript = await prisma.transcript.delete({
     *   where: {
     *     // ... filter to delete one Transcript
     *   }
     * })
     * 
     */
    delete<T extends TranscriptDeleteArgs>(args: SelectSubset<T, TranscriptDeleteArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transcript.
     * @param {TranscriptUpdateArgs} args - Arguments to update one Transcript.
     * @example
     * // Update one Transcript
     * const transcript = await prisma.transcript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptUpdateArgs>(args: SelectSubset<T, TranscriptUpdateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transcripts.
     * @param {TranscriptDeleteManyArgs} args - Arguments to filter Transcripts to delete.
     * @example
     * // Delete a few Transcripts
     * const { count } = await prisma.transcript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptDeleteManyArgs>(args?: SelectSubset<T, TranscriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptUpdateManyArgs>(args: SelectSubset<T, TranscriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts and returns the data updated in the database.
     * @param {TranscriptUpdateManyAndReturnArgs} args - Arguments to update many Transcripts.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TranscriptUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transcript.
     * @param {TranscriptUpsertArgs} args - Arguments to update or create a Transcript.
     * @example
     * // Update or create a Transcript
     * const transcript = await prisma.transcript.upsert({
     *   create: {
     *     // ... data to create a Transcript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transcript we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptUpsertArgs>(args: SelectSubset<T, TranscriptUpsertArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptCountArgs} args - Arguments to filter Transcripts to count.
     * @example
     * // Count the number of Transcripts
     * const count = await prisma.transcript.count({
     *   where: {
     *     // ... the filter for the Transcripts we want to count
     *   }
     * })
    **/
    count<T extends TranscriptCountArgs>(
      args?: Subset<T, TranscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptAggregateArgs>(args: Subset<T, TranscriptAggregateArgs>): Prisma.PrismaPromise<GetTranscriptAggregateType<T>>

    /**
     * Group by Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transcript model
   */
  readonly fields: TranscriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transcript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    segments<T extends Transcript$segmentsArgs<ExtArgs> = {}>(args?: Subset<T, Transcript$segmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transcript model
   */
  interface TranscriptFieldRefs {
    readonly id: FieldRef<"Transcript", 'String'>
    readonly meetingId: FieldRef<"Transcript", 'String'>
    readonly fullTranscript: FieldRef<"Transcript", 'String'>
    readonly language: FieldRef<"Transcript", 'String'>
    readonly createdAt: FieldRef<"Transcript", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transcript findUnique
   */
  export type TranscriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findUniqueOrThrow
   */
  export type TranscriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findFirst
   */
  export type TranscriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findFirstOrThrow
   */
  export type TranscriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findMany
   */
  export type TranscriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcripts to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript create
   */
  export type TranscriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Transcript.
     */
    data: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
  }

  /**
   * Transcript createMany
   */
  export type TranscriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transcript createManyAndReturn
   */
  export type TranscriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript update
   */
  export type TranscriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Transcript.
     */
    data: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
    /**
     * Choose, which Transcript to update.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript updateMany
   */
  export type TranscriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
  }

  /**
   * Transcript updateManyAndReturn
   */
  export type TranscriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript upsert
   */
  export type TranscriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Transcript to update in case it exists.
     */
    where: TranscriptWhereUniqueInput
    /**
     * In case the Transcript found by the `where` argument doesn't exist, create a new Transcript with this data.
     */
    create: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
    /**
     * In case the Transcript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
  }

  /**
   * Transcript delete
   */
  export type TranscriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter which Transcript to delete.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript deleteMany
   */
  export type TranscriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcripts to delete
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to delete.
     */
    limit?: number
  }

  /**
   * Transcript.segments
   */
  export type Transcript$segmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    where?: TranscriptSegmentWhereInput
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    cursor?: TranscriptSegmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * Transcript without action
   */
  export type TranscriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
  }


  /**
   * Model TranscriptSegment
   */

  export type AggregateTranscriptSegment = {
    _count: TranscriptSegmentCountAggregateOutputType | null
    _avg: TranscriptSegmentAvgAggregateOutputType | null
    _sum: TranscriptSegmentSumAggregateOutputType | null
    _min: TranscriptSegmentMinAggregateOutputType | null
    _max: TranscriptSegmentMaxAggregateOutputType | null
  }

  export type TranscriptSegmentAvgAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    confidence: number | null
  }

  export type TranscriptSegmentSumAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    confidence: number | null
  }

  export type TranscriptSegmentMinAggregateOutputType = {
    id: string | null
    transcriptId: string | null
    participantId: string | null
    startTime: number | null
    endTime: number | null
    spokenAt: Date | null
    text: string | null
    confidence: number | null
  }

  export type TranscriptSegmentMaxAggregateOutputType = {
    id: string | null
    transcriptId: string | null
    participantId: string | null
    startTime: number | null
    endTime: number | null
    spokenAt: Date | null
    text: string | null
    confidence: number | null
  }

  export type TranscriptSegmentCountAggregateOutputType = {
    id: number
    transcriptId: number
    participantId: number
    startTime: number
    endTime: number
    spokenAt: number
    text: number
    confidence: number
    _all: number
  }


  export type TranscriptSegmentAvgAggregateInputType = {
    startTime?: true
    endTime?: true
    confidence?: true
  }

  export type TranscriptSegmentSumAggregateInputType = {
    startTime?: true
    endTime?: true
    confidence?: true
  }

  export type TranscriptSegmentMinAggregateInputType = {
    id?: true
    transcriptId?: true
    participantId?: true
    startTime?: true
    endTime?: true
    spokenAt?: true
    text?: true
    confidence?: true
  }

  export type TranscriptSegmentMaxAggregateInputType = {
    id?: true
    transcriptId?: true
    participantId?: true
    startTime?: true
    endTime?: true
    spokenAt?: true
    text?: true
    confidence?: true
  }

  export type TranscriptSegmentCountAggregateInputType = {
    id?: true
    transcriptId?: true
    participantId?: true
    startTime?: true
    endTime?: true
    spokenAt?: true
    text?: true
    confidence?: true
    _all?: true
  }

  export type TranscriptSegmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptSegment to aggregate.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TranscriptSegments
    **/
    _count?: true | TranscriptSegmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranscriptSegmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranscriptSegmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptSegmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptSegmentMaxAggregateInputType
  }

  export type GetTranscriptSegmentAggregateType<T extends TranscriptSegmentAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscriptSegment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscriptSegment[P]>
      : GetScalarType<T[P], AggregateTranscriptSegment[P]>
  }




  export type TranscriptSegmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptSegmentWhereInput
    orderBy?: TranscriptSegmentOrderByWithAggregationInput | TranscriptSegmentOrderByWithAggregationInput[]
    by: TranscriptSegmentScalarFieldEnum[] | TranscriptSegmentScalarFieldEnum
    having?: TranscriptSegmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptSegmentCountAggregateInputType | true
    _avg?: TranscriptSegmentAvgAggregateInputType
    _sum?: TranscriptSegmentSumAggregateInputType
    _min?: TranscriptSegmentMinAggregateInputType
    _max?: TranscriptSegmentMaxAggregateInputType
  }

  export type TranscriptSegmentGroupByOutputType = {
    id: string
    transcriptId: string
    participantId: string
    startTime: number
    endTime: number
    spokenAt: Date
    text: string
    confidence: number
    _count: TranscriptSegmentCountAggregateOutputType | null
    _avg: TranscriptSegmentAvgAggregateOutputType | null
    _sum: TranscriptSegmentSumAggregateOutputType | null
    _min: TranscriptSegmentMinAggregateOutputType | null
    _max: TranscriptSegmentMaxAggregateOutputType | null
  }

  type GetTranscriptSegmentGroupByPayload<T extends TranscriptSegmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptSegmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptSegmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptSegmentGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptSegmentGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSegmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    participantId?: boolean
    startTime?: boolean
    endTime?: boolean
    spokenAt?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    participantId?: boolean
    startTime?: boolean
    endTime?: boolean
    spokenAt?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    participantId?: boolean
    startTime?: boolean
    endTime?: boolean
    spokenAt?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectScalar = {
    id?: boolean
    transcriptId?: boolean
    participantId?: boolean
    startTime?: boolean
    endTime?: boolean
    spokenAt?: boolean
    text?: boolean
    confidence?: boolean
  }

  export type TranscriptSegmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transcriptId" | "participantId" | "startTime" | "endTime" | "spokenAt" | "text" | "confidence", ExtArgs["result"]["transcriptSegment"]>
  export type TranscriptSegmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type TranscriptSegmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type TranscriptSegmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }

  export type $TranscriptSegmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TranscriptSegment"
    objects: {
      transcript: Prisma.$TranscriptPayload<ExtArgs>
      participant: Prisma.$ParticipantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transcriptId: string
      participantId: string
      startTime: number
      endTime: number
      spokenAt: Date
      text: string
      confidence: number
    }, ExtArgs["result"]["transcriptSegment"]>
    composites: {}
  }

  type TranscriptSegmentGetPayload<S extends boolean | null | undefined | TranscriptSegmentDefaultArgs> = $Result.GetResult<Prisma.$TranscriptSegmentPayload, S>

  type TranscriptSegmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptSegmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptSegmentCountAggregateInputType | true
    }

  export interface TranscriptSegmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TranscriptSegment'], meta: { name: 'TranscriptSegment' } }
    /**
     * Find zero or one TranscriptSegment that matches the filter.
     * @param {TranscriptSegmentFindUniqueArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptSegmentFindUniqueArgs>(args: SelectSubset<T, TranscriptSegmentFindUniqueArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TranscriptSegment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptSegmentFindUniqueOrThrowArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptSegmentFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TranscriptSegment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindFirstArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptSegmentFindFirstArgs>(args?: SelectSubset<T, TranscriptSegmentFindFirstArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TranscriptSegment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindFirstOrThrowArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptSegmentFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptSegmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TranscriptSegments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TranscriptSegments
     * const transcriptSegments = await prisma.transcriptSegment.findMany()
     * 
     * // Get first 10 TranscriptSegments
     * const transcriptSegments = await prisma.transcriptSegment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptSegmentFindManyArgs>(args?: SelectSubset<T, TranscriptSegmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TranscriptSegment.
     * @param {TranscriptSegmentCreateArgs} args - Arguments to create a TranscriptSegment.
     * @example
     * // Create one TranscriptSegment
     * const TranscriptSegment = await prisma.transcriptSegment.create({
     *   data: {
     *     // ... data to create a TranscriptSegment
     *   }
     * })
     * 
     */
    create<T extends TranscriptSegmentCreateArgs>(args: SelectSubset<T, TranscriptSegmentCreateArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TranscriptSegments.
     * @param {TranscriptSegmentCreateManyArgs} args - Arguments to create many TranscriptSegments.
     * @example
     * // Create many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptSegmentCreateManyArgs>(args?: SelectSubset<T, TranscriptSegmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TranscriptSegments and returns the data saved in the database.
     * @param {TranscriptSegmentCreateManyAndReturnArgs} args - Arguments to create many TranscriptSegments.
     * @example
     * // Create many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TranscriptSegments and only return the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptSegmentCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptSegmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TranscriptSegment.
     * @param {TranscriptSegmentDeleteArgs} args - Arguments to delete one TranscriptSegment.
     * @example
     * // Delete one TranscriptSegment
     * const TranscriptSegment = await prisma.transcriptSegment.delete({
     *   where: {
     *     // ... filter to delete one TranscriptSegment
     *   }
     * })
     * 
     */
    delete<T extends TranscriptSegmentDeleteArgs>(args: SelectSubset<T, TranscriptSegmentDeleteArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TranscriptSegment.
     * @param {TranscriptSegmentUpdateArgs} args - Arguments to update one TranscriptSegment.
     * @example
     * // Update one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptSegmentUpdateArgs>(args: SelectSubset<T, TranscriptSegmentUpdateArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TranscriptSegments.
     * @param {TranscriptSegmentDeleteManyArgs} args - Arguments to filter TranscriptSegments to delete.
     * @example
     * // Delete a few TranscriptSegments
     * const { count } = await prisma.transcriptSegment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptSegmentDeleteManyArgs>(args?: SelectSubset<T, TranscriptSegmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranscriptSegments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptSegmentUpdateManyArgs>(args: SelectSubset<T, TranscriptSegmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranscriptSegments and returns the data updated in the database.
     * @param {TranscriptSegmentUpdateManyAndReturnArgs} args - Arguments to update many TranscriptSegments.
     * @example
     * // Update many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TranscriptSegments and only return the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TranscriptSegmentUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TranscriptSegment.
     * @param {TranscriptSegmentUpsertArgs} args - Arguments to update or create a TranscriptSegment.
     * @example
     * // Update or create a TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.upsert({
     *   create: {
     *     // ... data to create a TranscriptSegment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TranscriptSegment we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptSegmentUpsertArgs>(args: SelectSubset<T, TranscriptSegmentUpsertArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TranscriptSegments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentCountArgs} args - Arguments to filter TranscriptSegments to count.
     * @example
     * // Count the number of TranscriptSegments
     * const count = await prisma.transcriptSegment.count({
     *   where: {
     *     // ... the filter for the TranscriptSegments we want to count
     *   }
     * })
    **/
    count<T extends TranscriptSegmentCountArgs>(
      args?: Subset<T, TranscriptSegmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptSegmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TranscriptSegment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptSegmentAggregateArgs>(args: Subset<T, TranscriptSegmentAggregateArgs>): Prisma.PrismaPromise<GetTranscriptSegmentAggregateType<T>>

    /**
     * Group by TranscriptSegment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptSegmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptSegmentGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptSegmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptSegmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptSegmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TranscriptSegment model
   */
  readonly fields: TranscriptSegmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TranscriptSegment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptSegmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transcript<T extends TranscriptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranscriptDefaultArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participant<T extends ParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ParticipantDefaultArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TranscriptSegment model
   */
  interface TranscriptSegmentFieldRefs {
    readonly id: FieldRef<"TranscriptSegment", 'String'>
    readonly transcriptId: FieldRef<"TranscriptSegment", 'String'>
    readonly participantId: FieldRef<"TranscriptSegment", 'String'>
    readonly startTime: FieldRef<"TranscriptSegment", 'Float'>
    readonly endTime: FieldRef<"TranscriptSegment", 'Float'>
    readonly spokenAt: FieldRef<"TranscriptSegment", 'DateTime'>
    readonly text: FieldRef<"TranscriptSegment", 'String'>
    readonly confidence: FieldRef<"TranscriptSegment", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * TranscriptSegment findUnique
   */
  export type TranscriptSegmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment findUniqueOrThrow
   */
  export type TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment findFirst
   */
  export type TranscriptSegmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment findFirstOrThrow
   */
  export type TranscriptSegmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment findMany
   */
  export type TranscriptSegmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegments to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment create
   */
  export type TranscriptSegmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The data needed to create a TranscriptSegment.
     */
    data: XOR<TranscriptSegmentCreateInput, TranscriptSegmentUncheckedCreateInput>
  }

  /**
   * TranscriptSegment createMany
   */
  export type TranscriptSegmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TranscriptSegments.
     */
    data: TranscriptSegmentCreateManyInput | TranscriptSegmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TranscriptSegment createManyAndReturn
   */
  export type TranscriptSegmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * The data used to create many TranscriptSegments.
     */
    data: TranscriptSegmentCreateManyInput | TranscriptSegmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TranscriptSegment update
   */
  export type TranscriptSegmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The data needed to update a TranscriptSegment.
     */
    data: XOR<TranscriptSegmentUpdateInput, TranscriptSegmentUncheckedUpdateInput>
    /**
     * Choose, which TranscriptSegment to update.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment updateMany
   */
  export type TranscriptSegmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TranscriptSegments.
     */
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyInput>
    /**
     * Filter which TranscriptSegments to update
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to update.
     */
    limit?: number
  }

  /**
   * TranscriptSegment updateManyAndReturn
   */
  export type TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * The data used to update TranscriptSegments.
     */
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyInput>
    /**
     * Filter which TranscriptSegments to update
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TranscriptSegment upsert
   */
  export type TranscriptSegmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The filter to search for the TranscriptSegment to update in case it exists.
     */
    where: TranscriptSegmentWhereUniqueInput
    /**
     * In case the TranscriptSegment found by the `where` argument doesn't exist, create a new TranscriptSegment with this data.
     */
    create: XOR<TranscriptSegmentCreateInput, TranscriptSegmentUncheckedCreateInput>
    /**
     * In case the TranscriptSegment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptSegmentUpdateInput, TranscriptSegmentUncheckedUpdateInput>
  }

  /**
   * TranscriptSegment delete
   */
  export type TranscriptSegmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter which TranscriptSegment to delete.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment deleteMany
   */
  export type TranscriptSegmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptSegments to delete
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to delete.
     */
    limit?: number
  }

  /**
   * TranscriptSegment without action
   */
  export type TranscriptSegmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
  }


  /**
   * Model MeetingSummary
   */

  export type AggregateMeetingSummary = {
    _count: MeetingSummaryCountAggregateOutputType | null
    _min: MeetingSummaryMinAggregateOutputType | null
    _max: MeetingSummaryMaxAggregateOutputType | null
  }

  export type MeetingSummaryMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    aiSummary: string | null
    editedSummary: string | null
    llmModel: string | null
    generatedAt: Date | null
    editedAt: Date | null
  }

  export type MeetingSummaryMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    aiSummary: string | null
    editedSummary: string | null
    llmModel: string | null
    generatedAt: Date | null
    editedAt: Date | null
  }

  export type MeetingSummaryCountAggregateOutputType = {
    id: number
    meetingId: number
    aiSummary: number
    editedSummary: number
    llmModel: number
    generatedAt: number
    editedAt: number
    _all: number
  }


  export type MeetingSummaryMinAggregateInputType = {
    id?: true
    meetingId?: true
    aiSummary?: true
    editedSummary?: true
    llmModel?: true
    generatedAt?: true
    editedAt?: true
  }

  export type MeetingSummaryMaxAggregateInputType = {
    id?: true
    meetingId?: true
    aiSummary?: true
    editedSummary?: true
    llmModel?: true
    generatedAt?: true
    editedAt?: true
  }

  export type MeetingSummaryCountAggregateInputType = {
    id?: true
    meetingId?: true
    aiSummary?: true
    editedSummary?: true
    llmModel?: true
    generatedAt?: true
    editedAt?: true
    _all?: true
  }

  export type MeetingSummaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingSummary to aggregate.
     */
    where?: MeetingSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingSummaries to fetch.
     */
    orderBy?: MeetingSummaryOrderByWithRelationInput | MeetingSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeetingSummaries
    **/
    _count?: true | MeetingSummaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingSummaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingSummaryMaxAggregateInputType
  }

  export type GetMeetingSummaryAggregateType<T extends MeetingSummaryAggregateArgs> = {
        [P in keyof T & keyof AggregateMeetingSummary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeetingSummary[P]>
      : GetScalarType<T[P], AggregateMeetingSummary[P]>
  }




  export type MeetingSummaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingSummaryWhereInput
    orderBy?: MeetingSummaryOrderByWithAggregationInput | MeetingSummaryOrderByWithAggregationInput[]
    by: MeetingSummaryScalarFieldEnum[] | MeetingSummaryScalarFieldEnum
    having?: MeetingSummaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingSummaryCountAggregateInputType | true
    _min?: MeetingSummaryMinAggregateInputType
    _max?: MeetingSummaryMaxAggregateInputType
  }

  export type MeetingSummaryGroupByOutputType = {
    id: string
    meetingId: string
    aiSummary: string
    editedSummary: string | null
    llmModel: string
    generatedAt: Date
    editedAt: Date | null
    _count: MeetingSummaryCountAggregateOutputType | null
    _min: MeetingSummaryMinAggregateOutputType | null
    _max: MeetingSummaryMaxAggregateOutputType | null
  }

  type GetMeetingSummaryGroupByPayload<T extends MeetingSummaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingSummaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingSummaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingSummaryGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingSummaryGroupByOutputType[P]>
        }
      >
    >


  export type MeetingSummarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    aiSummary?: boolean
    editedSummary?: boolean
    llmModel?: boolean
    generatedAt?: boolean
    editedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingSummary"]>

  export type MeetingSummarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    aiSummary?: boolean
    editedSummary?: boolean
    llmModel?: boolean
    generatedAt?: boolean
    editedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingSummary"]>

  export type MeetingSummarySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    aiSummary?: boolean
    editedSummary?: boolean
    llmModel?: boolean
    generatedAt?: boolean
    editedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingSummary"]>

  export type MeetingSummarySelectScalar = {
    id?: boolean
    meetingId?: boolean
    aiSummary?: boolean
    editedSummary?: boolean
    llmModel?: boolean
    generatedAt?: boolean
    editedAt?: boolean
  }

  export type MeetingSummaryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "aiSummary" | "editedSummary" | "llmModel" | "generatedAt" | "editedAt", ExtArgs["result"]["meetingSummary"]>
  export type MeetingSummaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingSummaryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingSummaryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $MeetingSummaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeetingSummary"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      aiSummary: string
      editedSummary: string | null
      llmModel: string
      generatedAt: Date
      editedAt: Date | null
    }, ExtArgs["result"]["meetingSummary"]>
    composites: {}
  }

  type MeetingSummaryGetPayload<S extends boolean | null | undefined | MeetingSummaryDefaultArgs> = $Result.GetResult<Prisma.$MeetingSummaryPayload, S>

  type MeetingSummaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingSummaryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingSummaryCountAggregateInputType | true
    }

  export interface MeetingSummaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeetingSummary'], meta: { name: 'MeetingSummary' } }
    /**
     * Find zero or one MeetingSummary that matches the filter.
     * @param {MeetingSummaryFindUniqueArgs} args - Arguments to find a MeetingSummary
     * @example
     * // Get one MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingSummaryFindUniqueArgs>(args: SelectSubset<T, MeetingSummaryFindUniqueArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeetingSummary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingSummaryFindUniqueOrThrowArgs} args - Arguments to find a MeetingSummary
     * @example
     * // Get one MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingSummaryFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingSummaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingSummary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryFindFirstArgs} args - Arguments to find a MeetingSummary
     * @example
     * // Get one MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingSummaryFindFirstArgs>(args?: SelectSubset<T, MeetingSummaryFindFirstArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingSummary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryFindFirstOrThrowArgs} args - Arguments to find a MeetingSummary
     * @example
     * // Get one MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingSummaryFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingSummaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeetingSummaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeetingSummaries
     * const meetingSummaries = await prisma.meetingSummary.findMany()
     * 
     * // Get first 10 MeetingSummaries
     * const meetingSummaries = await prisma.meetingSummary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingSummaryWithIdOnly = await prisma.meetingSummary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingSummaryFindManyArgs>(args?: SelectSubset<T, MeetingSummaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeetingSummary.
     * @param {MeetingSummaryCreateArgs} args - Arguments to create a MeetingSummary.
     * @example
     * // Create one MeetingSummary
     * const MeetingSummary = await prisma.meetingSummary.create({
     *   data: {
     *     // ... data to create a MeetingSummary
     *   }
     * })
     * 
     */
    create<T extends MeetingSummaryCreateArgs>(args: SelectSubset<T, MeetingSummaryCreateArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeetingSummaries.
     * @param {MeetingSummaryCreateManyArgs} args - Arguments to create many MeetingSummaries.
     * @example
     * // Create many MeetingSummaries
     * const meetingSummary = await prisma.meetingSummary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingSummaryCreateManyArgs>(args?: SelectSubset<T, MeetingSummaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeetingSummaries and returns the data saved in the database.
     * @param {MeetingSummaryCreateManyAndReturnArgs} args - Arguments to create many MeetingSummaries.
     * @example
     * // Create many MeetingSummaries
     * const meetingSummary = await prisma.meetingSummary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeetingSummaries and only return the `id`
     * const meetingSummaryWithIdOnly = await prisma.meetingSummary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingSummaryCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingSummaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeetingSummary.
     * @param {MeetingSummaryDeleteArgs} args - Arguments to delete one MeetingSummary.
     * @example
     * // Delete one MeetingSummary
     * const MeetingSummary = await prisma.meetingSummary.delete({
     *   where: {
     *     // ... filter to delete one MeetingSummary
     *   }
     * })
     * 
     */
    delete<T extends MeetingSummaryDeleteArgs>(args: SelectSubset<T, MeetingSummaryDeleteArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeetingSummary.
     * @param {MeetingSummaryUpdateArgs} args - Arguments to update one MeetingSummary.
     * @example
     * // Update one MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingSummaryUpdateArgs>(args: SelectSubset<T, MeetingSummaryUpdateArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeetingSummaries.
     * @param {MeetingSummaryDeleteManyArgs} args - Arguments to filter MeetingSummaries to delete.
     * @example
     * // Delete a few MeetingSummaries
     * const { count } = await prisma.meetingSummary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingSummaryDeleteManyArgs>(args?: SelectSubset<T, MeetingSummaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingSummaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeetingSummaries
     * const meetingSummary = await prisma.meetingSummary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingSummaryUpdateManyArgs>(args: SelectSubset<T, MeetingSummaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingSummaries and returns the data updated in the database.
     * @param {MeetingSummaryUpdateManyAndReturnArgs} args - Arguments to update many MeetingSummaries.
     * @example
     * // Update many MeetingSummaries
     * const meetingSummary = await prisma.meetingSummary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeetingSummaries and only return the `id`
     * const meetingSummaryWithIdOnly = await prisma.meetingSummary.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MeetingSummaryUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingSummaryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeetingSummary.
     * @param {MeetingSummaryUpsertArgs} args - Arguments to update or create a MeetingSummary.
     * @example
     * // Update or create a MeetingSummary
     * const meetingSummary = await prisma.meetingSummary.upsert({
     *   create: {
     *     // ... data to create a MeetingSummary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeetingSummary we want to update
     *   }
     * })
     */
    upsert<T extends MeetingSummaryUpsertArgs>(args: SelectSubset<T, MeetingSummaryUpsertArgs<ExtArgs>>): Prisma__MeetingSummaryClient<$Result.GetResult<Prisma.$MeetingSummaryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeetingSummaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryCountArgs} args - Arguments to filter MeetingSummaries to count.
     * @example
     * // Count the number of MeetingSummaries
     * const count = await prisma.meetingSummary.count({
     *   where: {
     *     // ... the filter for the MeetingSummaries we want to count
     *   }
     * })
    **/
    count<T extends MeetingSummaryCountArgs>(
      args?: Subset<T, MeetingSummaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingSummaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeetingSummary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MeetingSummaryAggregateArgs>(args: Subset<T, MeetingSummaryAggregateArgs>): Prisma.PrismaPromise<GetMeetingSummaryAggregateType<T>>

    /**
     * Group by MeetingSummary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingSummaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MeetingSummaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingSummaryGroupByArgs['orderBy'] }
        : { orderBy?: MeetingSummaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MeetingSummaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingSummaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeetingSummary model
   */
  readonly fields: MeetingSummaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeetingSummary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingSummaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MeetingSummary model
   */
  interface MeetingSummaryFieldRefs {
    readonly id: FieldRef<"MeetingSummary", 'String'>
    readonly meetingId: FieldRef<"MeetingSummary", 'String'>
    readonly aiSummary: FieldRef<"MeetingSummary", 'String'>
    readonly editedSummary: FieldRef<"MeetingSummary", 'String'>
    readonly llmModel: FieldRef<"MeetingSummary", 'String'>
    readonly generatedAt: FieldRef<"MeetingSummary", 'DateTime'>
    readonly editedAt: FieldRef<"MeetingSummary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MeetingSummary findUnique
   */
  export type MeetingSummaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter, which MeetingSummary to fetch.
     */
    where: MeetingSummaryWhereUniqueInput
  }

  /**
   * MeetingSummary findUniqueOrThrow
   */
  export type MeetingSummaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter, which MeetingSummary to fetch.
     */
    where: MeetingSummaryWhereUniqueInput
  }

  /**
   * MeetingSummary findFirst
   */
  export type MeetingSummaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter, which MeetingSummary to fetch.
     */
    where?: MeetingSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingSummaries to fetch.
     */
    orderBy?: MeetingSummaryOrderByWithRelationInput | MeetingSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingSummaries.
     */
    cursor?: MeetingSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingSummaries.
     */
    distinct?: MeetingSummaryScalarFieldEnum | MeetingSummaryScalarFieldEnum[]
  }

  /**
   * MeetingSummary findFirstOrThrow
   */
  export type MeetingSummaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter, which MeetingSummary to fetch.
     */
    where?: MeetingSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingSummaries to fetch.
     */
    orderBy?: MeetingSummaryOrderByWithRelationInput | MeetingSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingSummaries.
     */
    cursor?: MeetingSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingSummaries.
     */
    distinct?: MeetingSummaryScalarFieldEnum | MeetingSummaryScalarFieldEnum[]
  }

  /**
   * MeetingSummary findMany
   */
  export type MeetingSummaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter, which MeetingSummaries to fetch.
     */
    where?: MeetingSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingSummaries to fetch.
     */
    orderBy?: MeetingSummaryOrderByWithRelationInput | MeetingSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeetingSummaries.
     */
    cursor?: MeetingSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingSummaries.
     */
    distinct?: MeetingSummaryScalarFieldEnum | MeetingSummaryScalarFieldEnum[]
  }

  /**
   * MeetingSummary create
   */
  export type MeetingSummaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * The data needed to create a MeetingSummary.
     */
    data: XOR<MeetingSummaryCreateInput, MeetingSummaryUncheckedCreateInput>
  }

  /**
   * MeetingSummary createMany
   */
  export type MeetingSummaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeetingSummaries.
     */
    data: MeetingSummaryCreateManyInput | MeetingSummaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeetingSummary createManyAndReturn
   */
  export type MeetingSummaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * The data used to create many MeetingSummaries.
     */
    data: MeetingSummaryCreateManyInput | MeetingSummaryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingSummary update
   */
  export type MeetingSummaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * The data needed to update a MeetingSummary.
     */
    data: XOR<MeetingSummaryUpdateInput, MeetingSummaryUncheckedUpdateInput>
    /**
     * Choose, which MeetingSummary to update.
     */
    where: MeetingSummaryWhereUniqueInput
  }

  /**
   * MeetingSummary updateMany
   */
  export type MeetingSummaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeetingSummaries.
     */
    data: XOR<MeetingSummaryUpdateManyMutationInput, MeetingSummaryUncheckedUpdateManyInput>
    /**
     * Filter which MeetingSummaries to update
     */
    where?: MeetingSummaryWhereInput
    /**
     * Limit how many MeetingSummaries to update.
     */
    limit?: number
  }

  /**
   * MeetingSummary updateManyAndReturn
   */
  export type MeetingSummaryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * The data used to update MeetingSummaries.
     */
    data: XOR<MeetingSummaryUpdateManyMutationInput, MeetingSummaryUncheckedUpdateManyInput>
    /**
     * Filter which MeetingSummaries to update
     */
    where?: MeetingSummaryWhereInput
    /**
     * Limit how many MeetingSummaries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingSummary upsert
   */
  export type MeetingSummaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * The filter to search for the MeetingSummary to update in case it exists.
     */
    where: MeetingSummaryWhereUniqueInput
    /**
     * In case the MeetingSummary found by the `where` argument doesn't exist, create a new MeetingSummary with this data.
     */
    create: XOR<MeetingSummaryCreateInput, MeetingSummaryUncheckedCreateInput>
    /**
     * In case the MeetingSummary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingSummaryUpdateInput, MeetingSummaryUncheckedUpdateInput>
  }

  /**
   * MeetingSummary delete
   */
  export type MeetingSummaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
    /**
     * Filter which MeetingSummary to delete.
     */
    where: MeetingSummaryWhereUniqueInput
  }

  /**
   * MeetingSummary deleteMany
   */
  export type MeetingSummaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingSummaries to delete
     */
    where?: MeetingSummaryWhereInput
    /**
     * Limit how many MeetingSummaries to delete.
     */
    limit?: number
  }

  /**
   * MeetingSummary without action
   */
  export type MeetingSummaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingSummary
     */
    select?: MeetingSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingSummary
     */
    omit?: MeetingSummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingSummaryInclude<ExtArgs> | null
  }


  /**
   * Model Recording
   */

  export type AggregateRecording = {
    _count: RecordingCountAggregateOutputType | null
    _avg: RecordingAvgAggregateOutputType | null
    _sum: RecordingSumAggregateOutputType | null
    _min: RecordingMinAggregateOutputType | null
    _max: RecordingMaxAggregateOutputType | null
  }

  export type RecordingAvgAggregateOutputType = {
    startOffsetSeconds: number | null
    durationSeconds: number | null
    fileSize: number | null
  }

  export type RecordingSumAggregateOutputType = {
    startOffsetSeconds: number | null
    durationSeconds: number | null
    fileSize: bigint | null
  }

  export type RecordingMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    participantId: string | null
    fileName: string | null
    objectKey: string | null
    startOffsetSeconds: number | null
    durationSeconds: number | null
    fileSize: bigint | null
    mimeType: string | null
    createdAt: Date | null
  }

  export type RecordingMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    participantId: string | null
    fileName: string | null
    objectKey: string | null
    startOffsetSeconds: number | null
    durationSeconds: number | null
    fileSize: bigint | null
    mimeType: string | null
    createdAt: Date | null
  }

  export type RecordingCountAggregateOutputType = {
    id: number
    meetingId: number
    participantId: number
    fileName: number
    objectKey: number
    startOffsetSeconds: number
    durationSeconds: number
    fileSize: number
    mimeType: number
    createdAt: number
    _all: number
  }


  export type RecordingAvgAggregateInputType = {
    startOffsetSeconds?: true
    durationSeconds?: true
    fileSize?: true
  }

  export type RecordingSumAggregateInputType = {
    startOffsetSeconds?: true
    durationSeconds?: true
    fileSize?: true
  }

  export type RecordingMinAggregateInputType = {
    id?: true
    meetingId?: true
    participantId?: true
    fileName?: true
    objectKey?: true
    startOffsetSeconds?: true
    durationSeconds?: true
    fileSize?: true
    mimeType?: true
    createdAt?: true
  }

  export type RecordingMaxAggregateInputType = {
    id?: true
    meetingId?: true
    participantId?: true
    fileName?: true
    objectKey?: true
    startOffsetSeconds?: true
    durationSeconds?: true
    fileSize?: true
    mimeType?: true
    createdAt?: true
  }

  export type RecordingCountAggregateInputType = {
    id?: true
    meetingId?: true
    participantId?: true
    fileName?: true
    objectKey?: true
    startOffsetSeconds?: true
    durationSeconds?: true
    fileSize?: true
    mimeType?: true
    createdAt?: true
    _all?: true
  }

  export type RecordingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recording to aggregate.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recordings
    **/
    _count?: true | RecordingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecordingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecordingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecordingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecordingMaxAggregateInputType
  }

  export type GetRecordingAggregateType<T extends RecordingAggregateArgs> = {
        [P in keyof T & keyof AggregateRecording]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecording[P]>
      : GetScalarType<T[P], AggregateRecording[P]>
  }




  export type RecordingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecordingWhereInput
    orderBy?: RecordingOrderByWithAggregationInput | RecordingOrderByWithAggregationInput[]
    by: RecordingScalarFieldEnum[] | RecordingScalarFieldEnum
    having?: RecordingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecordingCountAggregateInputType | true
    _avg?: RecordingAvgAggregateInputType
    _sum?: RecordingSumAggregateInputType
    _min?: RecordingMinAggregateInputType
    _max?: RecordingMaxAggregateInputType
  }

  export type RecordingGroupByOutputType = {
    id: string
    meetingId: string
    participantId: string | null
    fileName: string
    objectKey: string
    startOffsetSeconds: number | null
    durationSeconds: number | null
    fileSize: bigint
    mimeType: string
    createdAt: Date
    _count: RecordingCountAggregateOutputType | null
    _avg: RecordingAvgAggregateOutputType | null
    _sum: RecordingSumAggregateOutputType | null
    _min: RecordingMinAggregateOutputType | null
    _max: RecordingMaxAggregateOutputType | null
  }

  type GetRecordingGroupByPayload<T extends RecordingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecordingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecordingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecordingGroupByOutputType[P]>
            : GetScalarType<T[P], RecordingGroupByOutputType[P]>
        }
      >
    >


  export type RecordingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    participantId?: boolean
    fileName?: boolean
    objectKey?: boolean
    startOffsetSeconds?: boolean
    durationSeconds?: boolean
    fileSize?: boolean
    mimeType?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }, ExtArgs["result"]["recording"]>

  export type RecordingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    participantId?: boolean
    fileName?: boolean
    objectKey?: boolean
    startOffsetSeconds?: boolean
    durationSeconds?: boolean
    fileSize?: boolean
    mimeType?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }, ExtArgs["result"]["recording"]>

  export type RecordingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    participantId?: boolean
    fileName?: boolean
    objectKey?: boolean
    startOffsetSeconds?: boolean
    durationSeconds?: boolean
    fileSize?: boolean
    mimeType?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }, ExtArgs["result"]["recording"]>

  export type RecordingSelectScalar = {
    id?: boolean
    meetingId?: boolean
    participantId?: boolean
    fileName?: boolean
    objectKey?: boolean
    startOffsetSeconds?: boolean
    durationSeconds?: boolean
    fileSize?: boolean
    mimeType?: boolean
    createdAt?: boolean
  }

  export type RecordingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "participantId" | "fileName" | "objectKey" | "startOffsetSeconds" | "durationSeconds" | "fileSize" | "mimeType" | "createdAt", ExtArgs["result"]["recording"]>
  export type RecordingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }
  export type RecordingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }
  export type RecordingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    participant?: boolean | Recording$participantArgs<ExtArgs>
  }

  export type $RecordingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recording"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
      participant: Prisma.$ParticipantPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      participantId: string | null
      fileName: string
      objectKey: string
      startOffsetSeconds: number | null
      durationSeconds: number | null
      fileSize: bigint
      mimeType: string
      createdAt: Date
    }, ExtArgs["result"]["recording"]>
    composites: {}
  }

  type RecordingGetPayload<S extends boolean | null | undefined | RecordingDefaultArgs> = $Result.GetResult<Prisma.$RecordingPayload, S>

  type RecordingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecordingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecordingCountAggregateInputType | true
    }

  export interface RecordingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recording'], meta: { name: 'Recording' } }
    /**
     * Find zero or one Recording that matches the filter.
     * @param {RecordingFindUniqueArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecordingFindUniqueArgs>(args: SelectSubset<T, RecordingFindUniqueArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Recording that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecordingFindUniqueOrThrowArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecordingFindUniqueOrThrowArgs>(args: SelectSubset<T, RecordingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recording that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindFirstArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecordingFindFirstArgs>(args?: SelectSubset<T, RecordingFindFirstArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recording that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindFirstOrThrowArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecordingFindFirstOrThrowArgs>(args?: SelectSubset<T, RecordingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Recordings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recordings
     * const recordings = await prisma.recording.findMany()
     * 
     * // Get first 10 Recordings
     * const recordings = await prisma.recording.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recordingWithIdOnly = await prisma.recording.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecordingFindManyArgs>(args?: SelectSubset<T, RecordingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Recording.
     * @param {RecordingCreateArgs} args - Arguments to create a Recording.
     * @example
     * // Create one Recording
     * const Recording = await prisma.recording.create({
     *   data: {
     *     // ... data to create a Recording
     *   }
     * })
     * 
     */
    create<T extends RecordingCreateArgs>(args: SelectSubset<T, RecordingCreateArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Recordings.
     * @param {RecordingCreateManyArgs} args - Arguments to create many Recordings.
     * @example
     * // Create many Recordings
     * const recording = await prisma.recording.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecordingCreateManyArgs>(args?: SelectSubset<T, RecordingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recordings and returns the data saved in the database.
     * @param {RecordingCreateManyAndReturnArgs} args - Arguments to create many Recordings.
     * @example
     * // Create many Recordings
     * const recording = await prisma.recording.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recordings and only return the `id`
     * const recordingWithIdOnly = await prisma.recording.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecordingCreateManyAndReturnArgs>(args?: SelectSubset<T, RecordingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Recording.
     * @param {RecordingDeleteArgs} args - Arguments to delete one Recording.
     * @example
     * // Delete one Recording
     * const Recording = await prisma.recording.delete({
     *   where: {
     *     // ... filter to delete one Recording
     *   }
     * })
     * 
     */
    delete<T extends RecordingDeleteArgs>(args: SelectSubset<T, RecordingDeleteArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Recording.
     * @param {RecordingUpdateArgs} args - Arguments to update one Recording.
     * @example
     * // Update one Recording
     * const recording = await prisma.recording.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecordingUpdateArgs>(args: SelectSubset<T, RecordingUpdateArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Recordings.
     * @param {RecordingDeleteManyArgs} args - Arguments to filter Recordings to delete.
     * @example
     * // Delete a few Recordings
     * const { count } = await prisma.recording.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecordingDeleteManyArgs>(args?: SelectSubset<T, RecordingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recordings
     * const recording = await prisma.recording.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecordingUpdateManyArgs>(args: SelectSubset<T, RecordingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recordings and returns the data updated in the database.
     * @param {RecordingUpdateManyAndReturnArgs} args - Arguments to update many Recordings.
     * @example
     * // Update many Recordings
     * const recording = await prisma.recording.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Recordings and only return the `id`
     * const recordingWithIdOnly = await prisma.recording.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecordingUpdateManyAndReturnArgs>(args: SelectSubset<T, RecordingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Recording.
     * @param {RecordingUpsertArgs} args - Arguments to update or create a Recording.
     * @example
     * // Update or create a Recording
     * const recording = await prisma.recording.upsert({
     *   create: {
     *     // ... data to create a Recording
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recording we want to update
     *   }
     * })
     */
    upsert<T extends RecordingUpsertArgs>(args: SelectSubset<T, RecordingUpsertArgs<ExtArgs>>): Prisma__RecordingClient<$Result.GetResult<Prisma.$RecordingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingCountArgs} args - Arguments to filter Recordings to count.
     * @example
     * // Count the number of Recordings
     * const count = await prisma.recording.count({
     *   where: {
     *     // ... the filter for the Recordings we want to count
     *   }
     * })
    **/
    count<T extends RecordingCountArgs>(
      args?: Subset<T, RecordingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecordingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recording.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecordingAggregateArgs>(args: Subset<T, RecordingAggregateArgs>): Prisma.PrismaPromise<GetRecordingAggregateType<T>>

    /**
     * Group by Recording.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecordingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecordingGroupByArgs['orderBy'] }
        : { orderBy?: RecordingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecordingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecordingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recording model
   */
  readonly fields: RecordingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recording.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecordingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participant<T extends Recording$participantArgs<ExtArgs> = {}>(args?: Subset<T, Recording$participantArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Recording model
   */
  interface RecordingFieldRefs {
    readonly id: FieldRef<"Recording", 'String'>
    readonly meetingId: FieldRef<"Recording", 'String'>
    readonly participantId: FieldRef<"Recording", 'String'>
    readonly fileName: FieldRef<"Recording", 'String'>
    readonly objectKey: FieldRef<"Recording", 'String'>
    readonly startOffsetSeconds: FieldRef<"Recording", 'Float'>
    readonly durationSeconds: FieldRef<"Recording", 'Int'>
    readonly fileSize: FieldRef<"Recording", 'BigInt'>
    readonly mimeType: FieldRef<"Recording", 'String'>
    readonly createdAt: FieldRef<"Recording", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recording findUnique
   */
  export type RecordingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter, which Recording to fetch.
     */
    where: RecordingWhereUniqueInput
  }

  /**
   * Recording findUniqueOrThrow
   */
  export type RecordingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter, which Recording to fetch.
     */
    where: RecordingWhereUniqueInput
  }

  /**
   * Recording findFirst
   */
  export type RecordingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter, which Recording to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recordings.
     */
    distinct?: RecordingScalarFieldEnum | RecordingScalarFieldEnum[]
  }

  /**
   * Recording findFirstOrThrow
   */
  export type RecordingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter, which Recording to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recordings.
     */
    distinct?: RecordingScalarFieldEnum | RecordingScalarFieldEnum[]
  }

  /**
   * Recording findMany
   */
  export type RecordingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter, which Recordings to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: RecordingOrderByWithRelationInput | RecordingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recordings.
     */
    distinct?: RecordingScalarFieldEnum | RecordingScalarFieldEnum[]
  }

  /**
   * Recording create
   */
  export type RecordingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * The data needed to create a Recording.
     */
    data: XOR<RecordingCreateInput, RecordingUncheckedCreateInput>
  }

  /**
   * Recording createMany
   */
  export type RecordingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recordings.
     */
    data: RecordingCreateManyInput | RecordingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recording createManyAndReturn
   */
  export type RecordingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * The data used to create many Recordings.
     */
    data: RecordingCreateManyInput | RecordingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recording update
   */
  export type RecordingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * The data needed to update a Recording.
     */
    data: XOR<RecordingUpdateInput, RecordingUncheckedUpdateInput>
    /**
     * Choose, which Recording to update.
     */
    where: RecordingWhereUniqueInput
  }

  /**
   * Recording updateMany
   */
  export type RecordingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recordings.
     */
    data: XOR<RecordingUpdateManyMutationInput, RecordingUncheckedUpdateManyInput>
    /**
     * Filter which Recordings to update
     */
    where?: RecordingWhereInput
    /**
     * Limit how many Recordings to update.
     */
    limit?: number
  }

  /**
   * Recording updateManyAndReturn
   */
  export type RecordingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * The data used to update Recordings.
     */
    data: XOR<RecordingUpdateManyMutationInput, RecordingUncheckedUpdateManyInput>
    /**
     * Filter which Recordings to update
     */
    where?: RecordingWhereInput
    /**
     * Limit how many Recordings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recording upsert
   */
  export type RecordingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * The filter to search for the Recording to update in case it exists.
     */
    where: RecordingWhereUniqueInput
    /**
     * In case the Recording found by the `where` argument doesn't exist, create a new Recording with this data.
     */
    create: XOR<RecordingCreateInput, RecordingUncheckedCreateInput>
    /**
     * In case the Recording was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecordingUpdateInput, RecordingUncheckedUpdateInput>
  }

  /**
   * Recording delete
   */
  export type RecordingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
    /**
     * Filter which Recording to delete.
     */
    where: RecordingWhereUniqueInput
  }

  /**
   * Recording deleteMany
   */
  export type RecordingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recordings to delete
     */
    where?: RecordingWhereInput
    /**
     * Limit how many Recordings to delete.
     */
    limit?: number
  }

  /**
   * Recording.participant
   */
  export type Recording$participantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
  }

  /**
   * Recording without action
   */
  export type RecordingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recording
     */
    omit?: RecordingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecordingInclude<ExtArgs> | null
  }


  /**
   * Model Export
   */

  export type AggregateExport = {
    _count: ExportCountAggregateOutputType | null
    _min: ExportMinAggregateOutputType | null
    _max: ExportMaxAggregateOutputType | null
  }

  export type ExportMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    exportFormat: string | null
    filePath: string | null
    exportedAt: Date | null
  }

  export type ExportMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    exportFormat: string | null
    filePath: string | null
    exportedAt: Date | null
  }

  export type ExportCountAggregateOutputType = {
    id: number
    meetingId: number
    exportFormat: number
    filePath: number
    exportedAt: number
    _all: number
  }


  export type ExportMinAggregateInputType = {
    id?: true
    meetingId?: true
    exportFormat?: true
    filePath?: true
    exportedAt?: true
  }

  export type ExportMaxAggregateInputType = {
    id?: true
    meetingId?: true
    exportFormat?: true
    filePath?: true
    exportedAt?: true
  }

  export type ExportCountAggregateInputType = {
    id?: true
    meetingId?: true
    exportFormat?: true
    filePath?: true
    exportedAt?: true
    _all?: true
  }

  export type ExportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Export to aggregate.
     */
    where?: ExportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exports to fetch.
     */
    orderBy?: ExportOrderByWithRelationInput | ExportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exports
    **/
    _count?: true | ExportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExportMaxAggregateInputType
  }

  export type GetExportAggregateType<T extends ExportAggregateArgs> = {
        [P in keyof T & keyof AggregateExport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExport[P]>
      : GetScalarType<T[P], AggregateExport[P]>
  }




  export type ExportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportWhereInput
    orderBy?: ExportOrderByWithAggregationInput | ExportOrderByWithAggregationInput[]
    by: ExportScalarFieldEnum[] | ExportScalarFieldEnum
    having?: ExportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExportCountAggregateInputType | true
    _min?: ExportMinAggregateInputType
    _max?: ExportMaxAggregateInputType
  }

  export type ExportGroupByOutputType = {
    id: string
    meetingId: string
    exportFormat: string
    filePath: string
    exportedAt: Date
    _count: ExportCountAggregateOutputType | null
    _min: ExportMinAggregateOutputType | null
    _max: ExportMaxAggregateOutputType | null
  }

  type GetExportGroupByPayload<T extends ExportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExportGroupByOutputType[P]>
            : GetScalarType<T[P], ExportGroupByOutputType[P]>
        }
      >
    >


  export type ExportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    exportFormat?: boolean
    filePath?: boolean
    exportedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["export"]>

  export type ExportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    exportFormat?: boolean
    filePath?: boolean
    exportedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["export"]>

  export type ExportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    exportFormat?: boolean
    filePath?: boolean
    exportedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["export"]>

  export type ExportSelectScalar = {
    id?: boolean
    meetingId?: boolean
    exportFormat?: boolean
    filePath?: boolean
    exportedAt?: boolean
  }

  export type ExportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "exportFormat" | "filePath" | "exportedAt", ExtArgs["result"]["export"]>
  export type ExportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type ExportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type ExportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $ExportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Export"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      exportFormat: string
      filePath: string
      exportedAt: Date
    }, ExtArgs["result"]["export"]>
    composites: {}
  }

  type ExportGetPayload<S extends boolean | null | undefined | ExportDefaultArgs> = $Result.GetResult<Prisma.$ExportPayload, S>

  type ExportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExportCountAggregateInputType | true
    }

  export interface ExportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Export'], meta: { name: 'Export' } }
    /**
     * Find zero or one Export that matches the filter.
     * @param {ExportFindUniqueArgs} args - Arguments to find a Export
     * @example
     * // Get one Export
     * const export = await prisma.export.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExportFindUniqueArgs>(args: SelectSubset<T, ExportFindUniqueArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Export that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExportFindUniqueOrThrowArgs} args - Arguments to find a Export
     * @example
     * // Get one Export
     * const export = await prisma.export.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExportFindUniqueOrThrowArgs>(args: SelectSubset<T, ExportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Export that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportFindFirstArgs} args - Arguments to find a Export
     * @example
     * // Get one Export
     * const export = await prisma.export.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExportFindFirstArgs>(args?: SelectSubset<T, ExportFindFirstArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Export that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportFindFirstOrThrowArgs} args - Arguments to find a Export
     * @example
     * // Get one Export
     * const export = await prisma.export.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExportFindFirstOrThrowArgs>(args?: SelectSubset<T, ExportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exports
     * const exports = await prisma.export.findMany()
     * 
     * // Get first 10 Exports
     * const exports = await prisma.export.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exportWithIdOnly = await prisma.export.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExportFindManyArgs>(args?: SelectSubset<T, ExportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Export.
     * @param {ExportCreateArgs} args - Arguments to create a Export.
     * @example
     * // Create one Export
     * const Export = await prisma.export.create({
     *   data: {
     *     // ... data to create a Export
     *   }
     * })
     * 
     */
    create<T extends ExportCreateArgs>(args: SelectSubset<T, ExportCreateArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exports.
     * @param {ExportCreateManyArgs} args - Arguments to create many Exports.
     * @example
     * // Create many Exports
     * const export = await prisma.export.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExportCreateManyArgs>(args?: SelectSubset<T, ExportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exports and returns the data saved in the database.
     * @param {ExportCreateManyAndReturnArgs} args - Arguments to create many Exports.
     * @example
     * // Create many Exports
     * const export = await prisma.export.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exports and only return the `id`
     * const exportWithIdOnly = await prisma.export.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExportCreateManyAndReturnArgs>(args?: SelectSubset<T, ExportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Export.
     * @param {ExportDeleteArgs} args - Arguments to delete one Export.
     * @example
     * // Delete one Export
     * const Export = await prisma.export.delete({
     *   where: {
     *     // ... filter to delete one Export
     *   }
     * })
     * 
     */
    delete<T extends ExportDeleteArgs>(args: SelectSubset<T, ExportDeleteArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Export.
     * @param {ExportUpdateArgs} args - Arguments to update one Export.
     * @example
     * // Update one Export
     * const export = await prisma.export.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExportUpdateArgs>(args: SelectSubset<T, ExportUpdateArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exports.
     * @param {ExportDeleteManyArgs} args - Arguments to filter Exports to delete.
     * @example
     * // Delete a few Exports
     * const { count } = await prisma.export.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExportDeleteManyArgs>(args?: SelectSubset<T, ExportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exports
     * const export = await prisma.export.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExportUpdateManyArgs>(args: SelectSubset<T, ExportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exports and returns the data updated in the database.
     * @param {ExportUpdateManyAndReturnArgs} args - Arguments to update many Exports.
     * @example
     * // Update many Exports
     * const export = await prisma.export.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exports and only return the `id`
     * const exportWithIdOnly = await prisma.export.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExportUpdateManyAndReturnArgs>(args: SelectSubset<T, ExportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Export.
     * @param {ExportUpsertArgs} args - Arguments to update or create a Export.
     * @example
     * // Update or create a Export
     * const export = await prisma.export.upsert({
     *   create: {
     *     // ... data to create a Export
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Export we want to update
     *   }
     * })
     */
    upsert<T extends ExportUpsertArgs>(args: SelectSubset<T, ExportUpsertArgs<ExtArgs>>): Prisma__ExportClient<$Result.GetResult<Prisma.$ExportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportCountArgs} args - Arguments to filter Exports to count.
     * @example
     * // Count the number of Exports
     * const count = await prisma.export.count({
     *   where: {
     *     // ... the filter for the Exports we want to count
     *   }
     * })
    **/
    count<T extends ExportCountArgs>(
      args?: Subset<T, ExportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Export.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExportAggregateArgs>(args: Subset<T, ExportAggregateArgs>): Prisma.PrismaPromise<GetExportAggregateType<T>>

    /**
     * Group by Export.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExportGroupByArgs['orderBy'] }
        : { orderBy?: ExportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Export model
   */
  readonly fields: ExportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Export.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Export model
   */
  interface ExportFieldRefs {
    readonly id: FieldRef<"Export", 'String'>
    readonly meetingId: FieldRef<"Export", 'String'>
    readonly exportFormat: FieldRef<"Export", 'String'>
    readonly filePath: FieldRef<"Export", 'String'>
    readonly exportedAt: FieldRef<"Export", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Export findUnique
   */
  export type ExportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter, which Export to fetch.
     */
    where: ExportWhereUniqueInput
  }

  /**
   * Export findUniqueOrThrow
   */
  export type ExportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter, which Export to fetch.
     */
    where: ExportWhereUniqueInput
  }

  /**
   * Export findFirst
   */
  export type ExportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter, which Export to fetch.
     */
    where?: ExportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exports to fetch.
     */
    orderBy?: ExportOrderByWithRelationInput | ExportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exports.
     */
    cursor?: ExportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exports.
     */
    distinct?: ExportScalarFieldEnum | ExportScalarFieldEnum[]
  }

  /**
   * Export findFirstOrThrow
   */
  export type ExportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter, which Export to fetch.
     */
    where?: ExportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exports to fetch.
     */
    orderBy?: ExportOrderByWithRelationInput | ExportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exports.
     */
    cursor?: ExportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exports.
     */
    distinct?: ExportScalarFieldEnum | ExportScalarFieldEnum[]
  }

  /**
   * Export findMany
   */
  export type ExportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter, which Exports to fetch.
     */
    where?: ExportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exports to fetch.
     */
    orderBy?: ExportOrderByWithRelationInput | ExportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exports.
     */
    cursor?: ExportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exports.
     */
    distinct?: ExportScalarFieldEnum | ExportScalarFieldEnum[]
  }

  /**
   * Export create
   */
  export type ExportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * The data needed to create a Export.
     */
    data: XOR<ExportCreateInput, ExportUncheckedCreateInput>
  }

  /**
   * Export createMany
   */
  export type ExportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exports.
     */
    data: ExportCreateManyInput | ExportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Export createManyAndReturn
   */
  export type ExportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * The data used to create many Exports.
     */
    data: ExportCreateManyInput | ExportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Export update
   */
  export type ExportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * The data needed to update a Export.
     */
    data: XOR<ExportUpdateInput, ExportUncheckedUpdateInput>
    /**
     * Choose, which Export to update.
     */
    where: ExportWhereUniqueInput
  }

  /**
   * Export updateMany
   */
  export type ExportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exports.
     */
    data: XOR<ExportUpdateManyMutationInput, ExportUncheckedUpdateManyInput>
    /**
     * Filter which Exports to update
     */
    where?: ExportWhereInput
    /**
     * Limit how many Exports to update.
     */
    limit?: number
  }

  /**
   * Export updateManyAndReturn
   */
  export type ExportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * The data used to update Exports.
     */
    data: XOR<ExportUpdateManyMutationInput, ExportUncheckedUpdateManyInput>
    /**
     * Filter which Exports to update
     */
    where?: ExportWhereInput
    /**
     * Limit how many Exports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Export upsert
   */
  export type ExportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * The filter to search for the Export to update in case it exists.
     */
    where: ExportWhereUniqueInput
    /**
     * In case the Export found by the `where` argument doesn't exist, create a new Export with this data.
     */
    create: XOR<ExportCreateInput, ExportUncheckedCreateInput>
    /**
     * In case the Export was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExportUpdateInput, ExportUncheckedUpdateInput>
  }

  /**
   * Export delete
   */
  export type ExportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
    /**
     * Filter which Export to delete.
     */
    where: ExportWhereUniqueInput
  }

  /**
   * Export deleteMany
   */
  export type ExportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exports to delete
     */
    where?: ExportWhereInput
    /**
     * Limit how many Exports to delete.
     */
    limit?: number
  }

  /**
   * Export without action
   */
  export type ExportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Export
     */
    select?: ExportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Export
     */
    omit?: ExportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    fullname: 'fullname',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MeetingRoomScalarFieldEnum: {
    id: 'id',
    hostId: 'hostId',
    roomName: 'roomName',
    roomHash: 'roomHash',
    maxParticipants: 'maxParticipants',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MeetingRoomScalarFieldEnum = (typeof MeetingRoomScalarFieldEnum)[keyof typeof MeetingRoomScalarFieldEnum]


  export const MeetingScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    durationSeconds: 'durationSeconds',
    createdAt: 'createdAt'
  };

  export type MeetingScalarFieldEnum = (typeof MeetingScalarFieldEnum)[keyof typeof MeetingScalarFieldEnum]


  export const ParticipantScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    userId: 'userId',
    displayName: 'displayName',
    createdAt: 'createdAt'
  };

  export type ParticipantScalarFieldEnum = (typeof ParticipantScalarFieldEnum)[keyof typeof ParticipantScalarFieldEnum]


  export const ParticipantSessionScalarFieldEnum: {
    id: 'id',
    participantId: 'participantId',
    joinedAt: 'joinedAt',
    lastSeenAt: 'lastSeenAt',
    leftAt: 'leftAt',
    durationSeconds: 'durationSeconds',
    connectionId: 'connectionId'
  };

  export type ParticipantSessionScalarFieldEnum = (typeof ParticipantSessionScalarFieldEnum)[keyof typeof ParticipantSessionScalarFieldEnum]


  export const TranscriptScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    fullTranscript: 'fullTranscript',
    language: 'language',
    createdAt: 'createdAt'
  };

  export type TranscriptScalarFieldEnum = (typeof TranscriptScalarFieldEnum)[keyof typeof TranscriptScalarFieldEnum]


  export const TranscriptSegmentScalarFieldEnum: {
    id: 'id',
    transcriptId: 'transcriptId',
    participantId: 'participantId',
    startTime: 'startTime',
    endTime: 'endTime',
    spokenAt: 'spokenAt',
    text: 'text',
    confidence: 'confidence'
  };

  export type TranscriptSegmentScalarFieldEnum = (typeof TranscriptSegmentScalarFieldEnum)[keyof typeof TranscriptSegmentScalarFieldEnum]


  export const MeetingSummaryScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    aiSummary: 'aiSummary',
    editedSummary: 'editedSummary',
    llmModel: 'llmModel',
    generatedAt: 'generatedAt',
    editedAt: 'editedAt'
  };

  export type MeetingSummaryScalarFieldEnum = (typeof MeetingSummaryScalarFieldEnum)[keyof typeof MeetingSummaryScalarFieldEnum]


  export const RecordingScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    participantId: 'participantId',
    fileName: 'fileName',
    objectKey: 'objectKey',
    startOffsetSeconds: 'startOffsetSeconds',
    durationSeconds: 'durationSeconds',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    createdAt: 'createdAt'
  };

  export type RecordingScalarFieldEnum = (typeof RecordingScalarFieldEnum)[keyof typeof RecordingScalarFieldEnum]


  export const ExportScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    exportFormat: 'exportFormat',
    filePath: 'filePath',
    exportedAt: 'exportedAt'
  };

  export type ExportScalarFieldEnum = (typeof ExportScalarFieldEnum)[keyof typeof ExportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    fullname?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    rooms?: MeetingRoomListRelationFilter
    participants?: ParticipantListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rooms?: MeetingRoomOrderByRelationAggregateInput
    participants?: ParticipantOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    fullname?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    rooms?: MeetingRoomListRelationFilter
    participants?: ParticipantListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    fullname?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MeetingRoomWhereInput = {
    AND?: MeetingRoomWhereInput | MeetingRoomWhereInput[]
    OR?: MeetingRoomWhereInput[]
    NOT?: MeetingRoomWhereInput | MeetingRoomWhereInput[]
    id?: StringFilter<"MeetingRoom"> | string
    hostId?: StringFilter<"MeetingRoom"> | string
    roomName?: StringFilter<"MeetingRoom"> | string
    roomHash?: StringFilter<"MeetingRoom"> | string
    maxParticipants?: IntFilter<"MeetingRoom"> | number
    status?: StringFilter<"MeetingRoom"> | string
    createdAt?: DateTimeFilter<"MeetingRoom"> | Date | string
    updatedAt?: DateTimeFilter<"MeetingRoom"> | Date | string
    host?: XOR<UserScalarRelationFilter, UserWhereInput>
    meetings?: MeetingListRelationFilter
  }

  export type MeetingRoomOrderByWithRelationInput = {
    id?: SortOrder
    hostId?: SortOrder
    roomName?: SortOrder
    roomHash?: SortOrder
    maxParticipants?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    host?: UserOrderByWithRelationInput
    meetings?: MeetingOrderByRelationAggregateInput
  }

  export type MeetingRoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomHash?: string
    AND?: MeetingRoomWhereInput | MeetingRoomWhereInput[]
    OR?: MeetingRoomWhereInput[]
    NOT?: MeetingRoomWhereInput | MeetingRoomWhereInput[]
    hostId?: StringFilter<"MeetingRoom"> | string
    roomName?: StringFilter<"MeetingRoom"> | string
    maxParticipants?: IntFilter<"MeetingRoom"> | number
    status?: StringFilter<"MeetingRoom"> | string
    createdAt?: DateTimeFilter<"MeetingRoom"> | Date | string
    updatedAt?: DateTimeFilter<"MeetingRoom"> | Date | string
    host?: XOR<UserScalarRelationFilter, UserWhereInput>
    meetings?: MeetingListRelationFilter
  }, "id" | "roomHash">

  export type MeetingRoomOrderByWithAggregationInput = {
    id?: SortOrder
    hostId?: SortOrder
    roomName?: SortOrder
    roomHash?: SortOrder
    maxParticipants?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MeetingRoomCountOrderByAggregateInput
    _avg?: MeetingRoomAvgOrderByAggregateInput
    _max?: MeetingRoomMaxOrderByAggregateInput
    _min?: MeetingRoomMinOrderByAggregateInput
    _sum?: MeetingRoomSumOrderByAggregateInput
  }

  export type MeetingRoomScalarWhereWithAggregatesInput = {
    AND?: MeetingRoomScalarWhereWithAggregatesInput | MeetingRoomScalarWhereWithAggregatesInput[]
    OR?: MeetingRoomScalarWhereWithAggregatesInput[]
    NOT?: MeetingRoomScalarWhereWithAggregatesInput | MeetingRoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeetingRoom"> | string
    hostId?: StringWithAggregatesFilter<"MeetingRoom"> | string
    roomName?: StringWithAggregatesFilter<"MeetingRoom"> | string
    roomHash?: StringWithAggregatesFilter<"MeetingRoom"> | string
    maxParticipants?: IntWithAggregatesFilter<"MeetingRoom"> | number
    status?: StringWithAggregatesFilter<"MeetingRoom"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MeetingRoom"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MeetingRoom"> | Date | string
  }

  export type MeetingWhereInput = {
    AND?: MeetingWhereInput | MeetingWhereInput[]
    OR?: MeetingWhereInput[]
    NOT?: MeetingWhereInput | MeetingWhereInput[]
    id?: StringFilter<"Meeting"> | string
    roomId?: StringFilter<"Meeting"> | string
    startedAt?: DateTimeFilter<"Meeting"> | Date | string
    endedAt?: DateTimeNullableFilter<"Meeting"> | Date | string | null
    durationSeconds?: IntNullableFilter<"Meeting"> | number | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
    room?: XOR<MeetingRoomScalarRelationFilter, MeetingRoomWhereInput>
    participants?: ParticipantListRelationFilter
    transcript?: XOR<TranscriptNullableScalarRelationFilter, TranscriptWhereInput> | null
    summary?: XOR<MeetingSummaryNullableScalarRelationFilter, MeetingSummaryWhereInput> | null
    recordings?: RecordingListRelationFilter
    exports?: ExportListRelationFilter
  }

  export type MeetingOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    room?: MeetingRoomOrderByWithRelationInput
    participants?: ParticipantOrderByRelationAggregateInput
    transcript?: TranscriptOrderByWithRelationInput
    summary?: MeetingSummaryOrderByWithRelationInput
    recordings?: RecordingOrderByRelationAggregateInput
    exports?: ExportOrderByRelationAggregateInput
  }

  export type MeetingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MeetingWhereInput | MeetingWhereInput[]
    OR?: MeetingWhereInput[]
    NOT?: MeetingWhereInput | MeetingWhereInput[]
    roomId?: StringFilter<"Meeting"> | string
    startedAt?: DateTimeFilter<"Meeting"> | Date | string
    endedAt?: DateTimeNullableFilter<"Meeting"> | Date | string | null
    durationSeconds?: IntNullableFilter<"Meeting"> | number | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
    room?: XOR<MeetingRoomScalarRelationFilter, MeetingRoomWhereInput>
    participants?: ParticipantListRelationFilter
    transcript?: XOR<TranscriptNullableScalarRelationFilter, TranscriptWhereInput> | null
    summary?: XOR<MeetingSummaryNullableScalarRelationFilter, MeetingSummaryWhereInput> | null
    recordings?: RecordingListRelationFilter
    exports?: ExportListRelationFilter
  }, "id">

  export type MeetingOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MeetingCountOrderByAggregateInput
    _avg?: MeetingAvgOrderByAggregateInput
    _max?: MeetingMaxOrderByAggregateInput
    _min?: MeetingMinOrderByAggregateInput
    _sum?: MeetingSumOrderByAggregateInput
  }

  export type MeetingScalarWhereWithAggregatesInput = {
    AND?: MeetingScalarWhereWithAggregatesInput | MeetingScalarWhereWithAggregatesInput[]
    OR?: MeetingScalarWhereWithAggregatesInput[]
    NOT?: MeetingScalarWhereWithAggregatesInput | MeetingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Meeting"> | string
    roomId?: StringWithAggregatesFilter<"Meeting"> | string
    startedAt?: DateTimeWithAggregatesFilter<"Meeting"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"Meeting"> | Date | string | null
    durationSeconds?: IntNullableWithAggregatesFilter<"Meeting"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Meeting"> | Date | string
  }

  export type ParticipantWhereInput = {
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    id?: StringFilter<"Participant"> | string
    meetingId?: StringFilter<"Participant"> | string
    userId?: StringNullableFilter<"Participant"> | string | null
    displayName?: StringFilter<"Participant"> | string
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sessions?: ParticipantSessionListRelationFilter
    segments?: TranscriptSegmentListRelationFilter
    recordings?: RecordingListRelationFilter
  }

  export type ParticipantOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrderInput | SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    sessions?: ParticipantSessionOrderByRelationAggregateInput
    segments?: TranscriptSegmentOrderByRelationAggregateInput
    recordings?: RecordingOrderByRelationAggregateInput
  }

  export type ParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    meetingId?: StringFilter<"Participant"> | string
    userId?: StringNullableFilter<"Participant"> | string | null
    displayName?: StringFilter<"Participant"> | string
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sessions?: ParticipantSessionListRelationFilter
    segments?: TranscriptSegmentListRelationFilter
    recordings?: RecordingListRelationFilter
  }, "id">

  export type ParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrderInput | SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    _count?: ParticipantCountOrderByAggregateInput
    _max?: ParticipantMaxOrderByAggregateInput
    _min?: ParticipantMinOrderByAggregateInput
  }

  export type ParticipantScalarWhereWithAggregatesInput = {
    AND?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    OR?: ParticipantScalarWhereWithAggregatesInput[]
    NOT?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Participant"> | string
    meetingId?: StringWithAggregatesFilter<"Participant"> | string
    userId?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    displayName?: StringWithAggregatesFilter<"Participant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
  }

  export type ParticipantSessionWhereInput = {
    AND?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    OR?: ParticipantSessionWhereInput[]
    NOT?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    id?: StringFilter<"ParticipantSession"> | string
    participantId?: StringFilter<"ParticipantSession"> | string
    joinedAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    lastSeenAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    leftAt?: DateTimeNullableFilter<"ParticipantSession"> | Date | string | null
    durationSeconds?: IntNullableFilter<"ParticipantSession"> | number | null
    connectionId?: StringFilter<"ParticipantSession"> | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }

  export type ParticipantSessionOrderByWithRelationInput = {
    id?: SortOrder
    participantId?: SortOrder
    joinedAt?: SortOrder
    lastSeenAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    connectionId?: SortOrder
    participant?: ParticipantOrderByWithRelationInput
  }

  export type ParticipantSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    OR?: ParticipantSessionWhereInput[]
    NOT?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    participantId?: StringFilter<"ParticipantSession"> | string
    joinedAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    lastSeenAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    leftAt?: DateTimeNullableFilter<"ParticipantSession"> | Date | string | null
    durationSeconds?: IntNullableFilter<"ParticipantSession"> | number | null
    connectionId?: StringFilter<"ParticipantSession"> | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }, "id">

  export type ParticipantSessionOrderByWithAggregationInput = {
    id?: SortOrder
    participantId?: SortOrder
    joinedAt?: SortOrder
    lastSeenAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    connectionId?: SortOrder
    _count?: ParticipantSessionCountOrderByAggregateInput
    _avg?: ParticipantSessionAvgOrderByAggregateInput
    _max?: ParticipantSessionMaxOrderByAggregateInput
    _min?: ParticipantSessionMinOrderByAggregateInput
    _sum?: ParticipantSessionSumOrderByAggregateInput
  }

  export type ParticipantSessionScalarWhereWithAggregatesInput = {
    AND?: ParticipantSessionScalarWhereWithAggregatesInput | ParticipantSessionScalarWhereWithAggregatesInput[]
    OR?: ParticipantSessionScalarWhereWithAggregatesInput[]
    NOT?: ParticipantSessionScalarWhereWithAggregatesInput | ParticipantSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ParticipantSession"> | string
    participantId?: StringWithAggregatesFilter<"ParticipantSession"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"ParticipantSession"> | Date | string
    lastSeenAt?: DateTimeWithAggregatesFilter<"ParticipantSession"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"ParticipantSession"> | Date | string | null
    durationSeconds?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    connectionId?: StringWithAggregatesFilter<"ParticipantSession"> | string
  }

  export type TranscriptWhereInput = {
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    id?: StringFilter<"Transcript"> | string
    meetingId?: StringFilter<"Transcript"> | string
    fullTranscript?: StringFilter<"Transcript"> | string
    language?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    segments?: TranscriptSegmentListRelationFilter
  }

  export type TranscriptOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullTranscript?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    segments?: TranscriptSegmentOrderByRelationAggregateInput
  }

  export type TranscriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    meetingId?: string
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    fullTranscript?: StringFilter<"Transcript"> | string
    language?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    segments?: TranscriptSegmentListRelationFilter
  }, "id" | "meetingId">

  export type TranscriptOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullTranscript?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    _count?: TranscriptCountOrderByAggregateInput
    _max?: TranscriptMaxOrderByAggregateInput
    _min?: TranscriptMinOrderByAggregateInput
  }

  export type TranscriptScalarWhereWithAggregatesInput = {
    AND?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    OR?: TranscriptScalarWhereWithAggregatesInput[]
    NOT?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transcript"> | string
    meetingId?: StringWithAggregatesFilter<"Transcript"> | string
    fullTranscript?: StringWithAggregatesFilter<"Transcript"> | string
    language?: StringWithAggregatesFilter<"Transcript"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
  }

  export type TranscriptSegmentWhereInput = {
    AND?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    OR?: TranscriptSegmentWhereInput[]
    NOT?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    id?: StringFilter<"TranscriptSegment"> | string
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    participantId?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    spokenAt?: DateTimeFilter<"TranscriptSegment"> | Date | string
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatFilter<"TranscriptSegment"> | number
    transcript?: XOR<TranscriptScalarRelationFilter, TranscriptWhereInput>
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }

  export type TranscriptSegmentOrderByWithRelationInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    participantId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    spokenAt?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
    transcript?: TranscriptOrderByWithRelationInput
    participant?: ParticipantOrderByWithRelationInput
  }

  export type TranscriptSegmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    OR?: TranscriptSegmentWhereInput[]
    NOT?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    participantId?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    spokenAt?: DateTimeFilter<"TranscriptSegment"> | Date | string
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatFilter<"TranscriptSegment"> | number
    transcript?: XOR<TranscriptScalarRelationFilter, TranscriptWhereInput>
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }, "id">

  export type TranscriptSegmentOrderByWithAggregationInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    participantId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    spokenAt?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
    _count?: TranscriptSegmentCountOrderByAggregateInput
    _avg?: TranscriptSegmentAvgOrderByAggregateInput
    _max?: TranscriptSegmentMaxOrderByAggregateInput
    _min?: TranscriptSegmentMinOrderByAggregateInput
    _sum?: TranscriptSegmentSumOrderByAggregateInput
  }

  export type TranscriptSegmentScalarWhereWithAggregatesInput = {
    AND?: TranscriptSegmentScalarWhereWithAggregatesInput | TranscriptSegmentScalarWhereWithAggregatesInput[]
    OR?: TranscriptSegmentScalarWhereWithAggregatesInput[]
    NOT?: TranscriptSegmentScalarWhereWithAggregatesInput | TranscriptSegmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    transcriptId?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    participantId?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    startTime?: FloatWithAggregatesFilter<"TranscriptSegment"> | number
    endTime?: FloatWithAggregatesFilter<"TranscriptSegment"> | number
    spokenAt?: DateTimeWithAggregatesFilter<"TranscriptSegment"> | Date | string
    text?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    confidence?: FloatWithAggregatesFilter<"TranscriptSegment"> | number
  }

  export type MeetingSummaryWhereInput = {
    AND?: MeetingSummaryWhereInput | MeetingSummaryWhereInput[]
    OR?: MeetingSummaryWhereInput[]
    NOT?: MeetingSummaryWhereInput | MeetingSummaryWhereInput[]
    id?: StringFilter<"MeetingSummary"> | string
    meetingId?: StringFilter<"MeetingSummary"> | string
    aiSummary?: StringFilter<"MeetingSummary"> | string
    editedSummary?: StringNullableFilter<"MeetingSummary"> | string | null
    llmModel?: StringFilter<"MeetingSummary"> | string
    generatedAt?: DateTimeFilter<"MeetingSummary"> | Date | string
    editedAt?: DateTimeNullableFilter<"MeetingSummary"> | Date | string | null
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type MeetingSummaryOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    aiSummary?: SortOrder
    editedSummary?: SortOrderInput | SortOrder
    llmModel?: SortOrder
    generatedAt?: SortOrder
    editedAt?: SortOrderInput | SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type MeetingSummaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    meetingId?: string
    AND?: MeetingSummaryWhereInput | MeetingSummaryWhereInput[]
    OR?: MeetingSummaryWhereInput[]
    NOT?: MeetingSummaryWhereInput | MeetingSummaryWhereInput[]
    aiSummary?: StringFilter<"MeetingSummary"> | string
    editedSummary?: StringNullableFilter<"MeetingSummary"> | string | null
    llmModel?: StringFilter<"MeetingSummary"> | string
    generatedAt?: DateTimeFilter<"MeetingSummary"> | Date | string
    editedAt?: DateTimeNullableFilter<"MeetingSummary"> | Date | string | null
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id" | "meetingId">

  export type MeetingSummaryOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    aiSummary?: SortOrder
    editedSummary?: SortOrderInput | SortOrder
    llmModel?: SortOrder
    generatedAt?: SortOrder
    editedAt?: SortOrderInput | SortOrder
    _count?: MeetingSummaryCountOrderByAggregateInput
    _max?: MeetingSummaryMaxOrderByAggregateInput
    _min?: MeetingSummaryMinOrderByAggregateInput
  }

  export type MeetingSummaryScalarWhereWithAggregatesInput = {
    AND?: MeetingSummaryScalarWhereWithAggregatesInput | MeetingSummaryScalarWhereWithAggregatesInput[]
    OR?: MeetingSummaryScalarWhereWithAggregatesInput[]
    NOT?: MeetingSummaryScalarWhereWithAggregatesInput | MeetingSummaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeetingSummary"> | string
    meetingId?: StringWithAggregatesFilter<"MeetingSummary"> | string
    aiSummary?: StringWithAggregatesFilter<"MeetingSummary"> | string
    editedSummary?: StringNullableWithAggregatesFilter<"MeetingSummary"> | string | null
    llmModel?: StringWithAggregatesFilter<"MeetingSummary"> | string
    generatedAt?: DateTimeWithAggregatesFilter<"MeetingSummary"> | Date | string
    editedAt?: DateTimeNullableWithAggregatesFilter<"MeetingSummary"> | Date | string | null
  }

  export type RecordingWhereInput = {
    AND?: RecordingWhereInput | RecordingWhereInput[]
    OR?: RecordingWhereInput[]
    NOT?: RecordingWhereInput | RecordingWhereInput[]
    id?: StringFilter<"Recording"> | string
    meetingId?: StringFilter<"Recording"> | string
    participantId?: StringNullableFilter<"Recording"> | string | null
    fileName?: StringFilter<"Recording"> | string
    objectKey?: StringFilter<"Recording"> | string
    startOffsetSeconds?: FloatNullableFilter<"Recording"> | number | null
    durationSeconds?: IntNullableFilter<"Recording"> | number | null
    fileSize?: BigIntFilter<"Recording"> | bigint | number
    mimeType?: StringFilter<"Recording"> | string
    createdAt?: DateTimeFilter<"Recording"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    participant?: XOR<ParticipantNullableScalarRelationFilter, ParticipantWhereInput> | null
  }

  export type RecordingOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    participantId?: SortOrderInput | SortOrder
    fileName?: SortOrder
    objectKey?: SortOrder
    startOffsetSeconds?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    participant?: ParticipantOrderByWithRelationInput
  }

  export type RecordingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RecordingWhereInput | RecordingWhereInput[]
    OR?: RecordingWhereInput[]
    NOT?: RecordingWhereInput | RecordingWhereInput[]
    meetingId?: StringFilter<"Recording"> | string
    participantId?: StringNullableFilter<"Recording"> | string | null
    fileName?: StringFilter<"Recording"> | string
    objectKey?: StringFilter<"Recording"> | string
    startOffsetSeconds?: FloatNullableFilter<"Recording"> | number | null
    durationSeconds?: IntNullableFilter<"Recording"> | number | null
    fileSize?: BigIntFilter<"Recording"> | bigint | number
    mimeType?: StringFilter<"Recording"> | string
    createdAt?: DateTimeFilter<"Recording"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    participant?: XOR<ParticipantNullableScalarRelationFilter, ParticipantWhereInput> | null
  }, "id">

  export type RecordingOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    participantId?: SortOrderInput | SortOrder
    fileName?: SortOrder
    objectKey?: SortOrder
    startOffsetSeconds?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    createdAt?: SortOrder
    _count?: RecordingCountOrderByAggregateInput
    _avg?: RecordingAvgOrderByAggregateInput
    _max?: RecordingMaxOrderByAggregateInput
    _min?: RecordingMinOrderByAggregateInput
    _sum?: RecordingSumOrderByAggregateInput
  }

  export type RecordingScalarWhereWithAggregatesInput = {
    AND?: RecordingScalarWhereWithAggregatesInput | RecordingScalarWhereWithAggregatesInput[]
    OR?: RecordingScalarWhereWithAggregatesInput[]
    NOT?: RecordingScalarWhereWithAggregatesInput | RecordingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Recording"> | string
    meetingId?: StringWithAggregatesFilter<"Recording"> | string
    participantId?: StringNullableWithAggregatesFilter<"Recording"> | string | null
    fileName?: StringWithAggregatesFilter<"Recording"> | string
    objectKey?: StringWithAggregatesFilter<"Recording"> | string
    startOffsetSeconds?: FloatNullableWithAggregatesFilter<"Recording"> | number | null
    durationSeconds?: IntNullableWithAggregatesFilter<"Recording"> | number | null
    fileSize?: BigIntWithAggregatesFilter<"Recording"> | bigint | number
    mimeType?: StringWithAggregatesFilter<"Recording"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Recording"> | Date | string
  }

  export type ExportWhereInput = {
    AND?: ExportWhereInput | ExportWhereInput[]
    OR?: ExportWhereInput[]
    NOT?: ExportWhereInput | ExportWhereInput[]
    id?: StringFilter<"Export"> | string
    meetingId?: StringFilter<"Export"> | string
    exportFormat?: StringFilter<"Export"> | string
    filePath?: StringFilter<"Export"> | string
    exportedAt?: DateTimeFilter<"Export"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type ExportOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    exportFormat?: SortOrder
    filePath?: SortOrder
    exportedAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type ExportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExportWhereInput | ExportWhereInput[]
    OR?: ExportWhereInput[]
    NOT?: ExportWhereInput | ExportWhereInput[]
    meetingId?: StringFilter<"Export"> | string
    exportFormat?: StringFilter<"Export"> | string
    filePath?: StringFilter<"Export"> | string
    exportedAt?: DateTimeFilter<"Export"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id">

  export type ExportOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    exportFormat?: SortOrder
    filePath?: SortOrder
    exportedAt?: SortOrder
    _count?: ExportCountOrderByAggregateInput
    _max?: ExportMaxOrderByAggregateInput
    _min?: ExportMinOrderByAggregateInput
  }

  export type ExportScalarWhereWithAggregatesInput = {
    AND?: ExportScalarWhereWithAggregatesInput | ExportScalarWhereWithAggregatesInput[]
    OR?: ExportScalarWhereWithAggregatesInput[]
    NOT?: ExportScalarWhereWithAggregatesInput | ExportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Export"> | string
    meetingId?: StringWithAggregatesFilter<"Export"> | string
    exportFormat?: StringWithAggregatesFilter<"Export"> | string
    filePath?: StringWithAggregatesFilter<"Export"> | string
    exportedAt?: DateTimeWithAggregatesFilter<"Export"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: MeetingRoomCreateNestedManyWithoutHostInput
    participants?: ParticipantCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: MeetingRoomUncheckedCreateNestedManyWithoutHostInput
    participants?: ParticipantUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: MeetingRoomUpdateManyWithoutHostNestedInput
    participants?: ParticipantUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: MeetingRoomUncheckedUpdateManyWithoutHostNestedInput
    participants?: ParticipantUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingRoomCreateInput = {
    id?: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    host: UserCreateNestedOneWithoutRoomsInput
    meetings?: MeetingCreateNestedManyWithoutRoomInput
  }

  export type MeetingRoomUncheckedCreateInput = {
    id?: string
    hostId: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meetings?: MeetingUncheckedCreateNestedManyWithoutRoomInput
  }

  export type MeetingRoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    host?: UserUpdateOneRequiredWithoutRoomsNestedInput
    meetings?: MeetingUpdateManyWithoutRoomNestedInput
  }

  export type MeetingRoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meetings?: MeetingUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type MeetingRoomCreateManyInput = {
    id?: string
    hostId: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MeetingRoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingRoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingCreateInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateManyInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
  }

  export type MeetingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
    user?: UserCreateNestedOneWithoutParticipantsInput
    sessions?: ParticipantSessionCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentCreateNestedManyWithoutParticipantInput
    recordings?: RecordingCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateInput = {
    id?: string
    meetingId: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
    sessions?: ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneWithoutParticipantsNestedInput
    sessions?: ParticipantSessionUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantCreateManyInput = {
    id?: string
    meetingId: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
  }

  export type ParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantSessionCreateInput = {
    id?: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
    participant: ParticipantCreateNestedOneWithoutSessionsInput
  }

  export type ParticipantSessionUncheckedCreateInput = {
    id?: string
    participantId: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
  }

  export type ParticipantSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
    participant?: ParticipantUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type ParticipantSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type ParticipantSessionCreateManyInput = {
    id?: string
    participantId: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
  }

  export type ParticipantSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type ParticipantSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type TranscriptCreateInput = {
    id?: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutTranscriptInput
    segments?: TranscriptSegmentCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateInput = {
    id?: string
    meetingId: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutTranscriptNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptCreateManyInput = {
    id?: string
    meetingId: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
  }

  export type TranscriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptSegmentCreateInput = {
    id?: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
    transcript: TranscriptCreateNestedOneWithoutSegmentsInput
    participant: ParticipantCreateNestedOneWithoutSegmentsInput
  }

  export type TranscriptSegmentUncheckedCreateInput = {
    id?: string
    transcriptId: string
    participantId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type TranscriptSegmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    transcript?: TranscriptUpdateOneRequiredWithoutSegmentsNestedInput
    participant?: ParticipantUpdateOneRequiredWithoutSegmentsNestedInput
  }

  export type TranscriptSegmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type TranscriptSegmentCreateManyInput = {
    id?: string
    transcriptId: string
    participantId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type TranscriptSegmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type TranscriptSegmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type MeetingSummaryCreateInput = {
    id?: string
    aiSummary: string
    editedSummary?: string | null
    llmModel: string
    generatedAt: Date | string
    editedAt?: Date | string | null
    meeting: MeetingCreateNestedOneWithoutSummaryInput
  }

  export type MeetingSummaryUncheckedCreateInput = {
    id?: string
    meetingId: string
    aiSummary: string
    editedSummary?: string | null
    llmModel: string
    generatedAt: Date | string
    editedAt?: Date | string | null
  }

  export type MeetingSummaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meeting?: MeetingUpdateOneRequiredWithoutSummaryNestedInput
  }

  export type MeetingSummaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MeetingSummaryCreateManyInput = {
    id?: string
    meetingId: string
    aiSummary: string
    editedSummary?: string | null
    llmModel: string
    generatedAt: Date | string
    editedAt?: Date | string | null
  }

  export type MeetingSummaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MeetingSummaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RecordingCreateInput = {
    id?: string
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutRecordingsInput
    participant?: ParticipantCreateNestedOneWithoutRecordingsInput
  }

  export type RecordingUncheckedCreateInput = {
    id?: string
    meetingId: string
    participantId?: string | null
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type RecordingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutRecordingsNestedInput
    participant?: ParticipantUpdateOneWithoutRecordingsNestedInput
  }

  export type RecordingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordingCreateManyInput = {
    id?: string
    meetingId: string
    participantId?: string | null
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type RecordingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportCreateInput = {
    id?: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
    meeting: MeetingCreateNestedOneWithoutExportsInput
  }

  export type ExportUncheckedCreateInput = {
    id?: string
    meetingId: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
  }

  export type ExportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutExportsNestedInput
  }

  export type ExportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportCreateManyInput = {
    id?: string
    meetingId: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
  }

  export type ExportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MeetingRoomListRelationFilter = {
    every?: MeetingRoomWhereInput
    some?: MeetingRoomWhereInput
    none?: MeetingRoomWhereInput
  }

  export type ParticipantListRelationFilter = {
    every?: ParticipantWhereInput
    some?: ParticipantWhereInput
    none?: ParticipantWhereInput
  }

  export type MeetingRoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MeetingListRelationFilter = {
    every?: MeetingWhereInput
    some?: MeetingWhereInput
    none?: MeetingWhereInput
  }

  export type MeetingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MeetingRoomCountOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    roomName?: SortOrder
    roomHash?: SortOrder
    maxParticipants?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingRoomAvgOrderByAggregateInput = {
    maxParticipants?: SortOrder
  }

  export type MeetingRoomMaxOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    roomName?: SortOrder
    roomHash?: SortOrder
    maxParticipants?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingRoomMinOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    roomName?: SortOrder
    roomHash?: SortOrder
    maxParticipants?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingRoomSumOrderByAggregateInput = {
    maxParticipants?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MeetingRoomScalarRelationFilter = {
    is?: MeetingRoomWhereInput
    isNot?: MeetingRoomWhereInput
  }

  export type TranscriptNullableScalarRelationFilter = {
    is?: TranscriptWhereInput | null
    isNot?: TranscriptWhereInput | null
  }

  export type MeetingSummaryNullableScalarRelationFilter = {
    is?: MeetingSummaryWhereInput | null
    isNot?: MeetingSummaryWhereInput | null
  }

  export type RecordingListRelationFilter = {
    every?: RecordingWhereInput
    some?: RecordingWhereInput
    none?: RecordingWhereInput
  }

  export type ExportListRelationFilter = {
    every?: ExportWhereInput
    some?: ExportWhereInput
    none?: ExportWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RecordingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MeetingCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type MeetingAvgOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type MeetingMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type MeetingMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type MeetingSumOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type MeetingScalarRelationFilter = {
    is?: MeetingWhereInput
    isNot?: MeetingWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ParticipantSessionListRelationFilter = {
    every?: ParticipantSessionWhereInput
    some?: ParticipantSessionWhereInput
    none?: ParticipantSessionWhereInput
  }

  export type TranscriptSegmentListRelationFilter = {
    every?: TranscriptSegmentWhereInput
    some?: TranscriptSegmentWhereInput
    none?: TranscriptSegmentWhereInput
  }

  export type ParticipantSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TranscriptSegmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
  }

  export type ParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
  }

  export type ParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ParticipantScalarRelationFilter = {
    is?: ParticipantWhereInput
    isNot?: ParticipantWhereInput
  }

  export type ParticipantSessionCountOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    joinedAt?: SortOrder
    lastSeenAt?: SortOrder
    leftAt?: SortOrder
    durationSeconds?: SortOrder
    connectionId?: SortOrder
  }

  export type ParticipantSessionAvgOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type ParticipantSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    joinedAt?: SortOrder
    lastSeenAt?: SortOrder
    leftAt?: SortOrder
    durationSeconds?: SortOrder
    connectionId?: SortOrder
  }

  export type ParticipantSessionMinOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    joinedAt?: SortOrder
    lastSeenAt?: SortOrder
    leftAt?: SortOrder
    durationSeconds?: SortOrder
    connectionId?: SortOrder
  }

  export type ParticipantSessionSumOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type TranscriptCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullTranscript?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type TranscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullTranscript?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type TranscriptMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullTranscript?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TranscriptScalarRelationFilter = {
    is?: TranscriptWhereInput
    isNot?: TranscriptWhereInput
  }

  export type TranscriptSegmentCountOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    participantId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    spokenAt?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentAvgOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentMaxOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    participantId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    spokenAt?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentMinOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    participantId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    spokenAt?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentSumOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type MeetingSummaryCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    aiSummary?: SortOrder
    editedSummary?: SortOrder
    llmModel?: SortOrder
    generatedAt?: SortOrder
    editedAt?: SortOrder
  }

  export type MeetingSummaryMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    aiSummary?: SortOrder
    editedSummary?: SortOrder
    llmModel?: SortOrder
    generatedAt?: SortOrder
    editedAt?: SortOrder
  }

  export type MeetingSummaryMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    aiSummary?: SortOrder
    editedSummary?: SortOrder
    llmModel?: SortOrder
    generatedAt?: SortOrder
    editedAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type ParticipantNullableScalarRelationFilter = {
    is?: ParticipantWhereInput | null
    isNot?: ParticipantWhereInput | null
  }

  export type RecordingCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    participantId?: SortOrder
    fileName?: SortOrder
    objectKey?: SortOrder
    startOffsetSeconds?: SortOrder
    durationSeconds?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordingAvgOrderByAggregateInput = {
    startOffsetSeconds?: SortOrder
    durationSeconds?: SortOrder
    fileSize?: SortOrder
  }

  export type RecordingMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    participantId?: SortOrder
    fileName?: SortOrder
    objectKey?: SortOrder
    startOffsetSeconds?: SortOrder
    durationSeconds?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordingMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    participantId?: SortOrder
    fileName?: SortOrder
    objectKey?: SortOrder
    startOffsetSeconds?: SortOrder
    durationSeconds?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordingSumOrderByAggregateInput = {
    startOffsetSeconds?: SortOrder
    durationSeconds?: SortOrder
    fileSize?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type ExportCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    exportFormat?: SortOrder
    filePath?: SortOrder
    exportedAt?: SortOrder
  }

  export type ExportMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    exportFormat?: SortOrder
    filePath?: SortOrder
    exportedAt?: SortOrder
  }

  export type ExportMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    exportFormat?: SortOrder
    filePath?: SortOrder
    exportedAt?: SortOrder
  }

  export type MeetingRoomCreateNestedManyWithoutHostInput = {
    create?: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput> | MeetingRoomCreateWithoutHostInput[] | MeetingRoomUncheckedCreateWithoutHostInput[]
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutHostInput | MeetingRoomCreateOrConnectWithoutHostInput[]
    createMany?: MeetingRoomCreateManyHostInputEnvelope
    connect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
  }

  export type ParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput> | ParticipantCreateWithoutUserInput[] | ParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutUserInput | ParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ParticipantCreateManyUserInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type MeetingRoomUncheckedCreateNestedManyWithoutHostInput = {
    create?: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput> | MeetingRoomCreateWithoutHostInput[] | MeetingRoomUncheckedCreateWithoutHostInput[]
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutHostInput | MeetingRoomCreateOrConnectWithoutHostInput[]
    createMany?: MeetingRoomCreateManyHostInputEnvelope
    connect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
  }

  export type ParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput> | ParticipantCreateWithoutUserInput[] | ParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutUserInput | ParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ParticipantCreateManyUserInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MeetingRoomUpdateManyWithoutHostNestedInput = {
    create?: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput> | MeetingRoomCreateWithoutHostInput[] | MeetingRoomUncheckedCreateWithoutHostInput[]
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutHostInput | MeetingRoomCreateOrConnectWithoutHostInput[]
    upsert?: MeetingRoomUpsertWithWhereUniqueWithoutHostInput | MeetingRoomUpsertWithWhereUniqueWithoutHostInput[]
    createMany?: MeetingRoomCreateManyHostInputEnvelope
    set?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    disconnect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    delete?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    connect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    update?: MeetingRoomUpdateWithWhereUniqueWithoutHostInput | MeetingRoomUpdateWithWhereUniqueWithoutHostInput[]
    updateMany?: MeetingRoomUpdateManyWithWhereWithoutHostInput | MeetingRoomUpdateManyWithWhereWithoutHostInput[]
    deleteMany?: MeetingRoomScalarWhereInput | MeetingRoomScalarWhereInput[]
  }

  export type ParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput> | ParticipantCreateWithoutUserInput[] | ParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutUserInput | ParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutUserInput | ParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ParticipantCreateManyUserInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutUserInput | ParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutUserInput | ParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type MeetingRoomUncheckedUpdateManyWithoutHostNestedInput = {
    create?: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput> | MeetingRoomCreateWithoutHostInput[] | MeetingRoomUncheckedCreateWithoutHostInput[]
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutHostInput | MeetingRoomCreateOrConnectWithoutHostInput[]
    upsert?: MeetingRoomUpsertWithWhereUniqueWithoutHostInput | MeetingRoomUpsertWithWhereUniqueWithoutHostInput[]
    createMany?: MeetingRoomCreateManyHostInputEnvelope
    set?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    disconnect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    delete?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    connect?: MeetingRoomWhereUniqueInput | MeetingRoomWhereUniqueInput[]
    update?: MeetingRoomUpdateWithWhereUniqueWithoutHostInput | MeetingRoomUpdateWithWhereUniqueWithoutHostInput[]
    updateMany?: MeetingRoomUpdateManyWithWhereWithoutHostInput | MeetingRoomUpdateManyWithWhereWithoutHostInput[]
    deleteMany?: MeetingRoomScalarWhereInput | MeetingRoomScalarWhereInput[]
  }

  export type ParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput> | ParticipantCreateWithoutUserInput[] | ParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutUserInput | ParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutUserInput | ParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ParticipantCreateManyUserInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutUserInput | ParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutUserInput | ParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRoomsInput = {
    create?: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoomsInput
    connect?: UserWhereUniqueInput
  }

  export type MeetingCreateNestedManyWithoutRoomInput = {
    create?: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput> | MeetingCreateWithoutRoomInput[] | MeetingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutRoomInput | MeetingCreateOrConnectWithoutRoomInput[]
    createMany?: MeetingCreateManyRoomInputEnvelope
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
  }

  export type MeetingUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput> | MeetingCreateWithoutRoomInput[] | MeetingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutRoomInput | MeetingCreateOrConnectWithoutRoomInput[]
    createMany?: MeetingCreateManyRoomInputEnvelope
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutRoomsNestedInput = {
    create?: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoomsInput
    upsert?: UserUpsertWithoutRoomsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRoomsInput, UserUpdateWithoutRoomsInput>, UserUncheckedUpdateWithoutRoomsInput>
  }

  export type MeetingUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput> | MeetingCreateWithoutRoomInput[] | MeetingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutRoomInput | MeetingCreateOrConnectWithoutRoomInput[]
    upsert?: MeetingUpsertWithWhereUniqueWithoutRoomInput | MeetingUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MeetingCreateManyRoomInputEnvelope
    set?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    disconnect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    delete?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    update?: MeetingUpdateWithWhereUniqueWithoutRoomInput | MeetingUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MeetingUpdateManyWithWhereWithoutRoomInput | MeetingUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
  }

  export type MeetingUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput> | MeetingCreateWithoutRoomInput[] | MeetingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutRoomInput | MeetingCreateOrConnectWithoutRoomInput[]
    upsert?: MeetingUpsertWithWhereUniqueWithoutRoomInput | MeetingUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MeetingCreateManyRoomInputEnvelope
    set?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    disconnect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    delete?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    update?: MeetingUpdateWithWhereUniqueWithoutRoomInput | MeetingUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MeetingUpdateManyWithWhereWithoutRoomInput | MeetingUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
  }

  export type MeetingRoomCreateNestedOneWithoutMeetingsInput = {
    create?: XOR<MeetingRoomCreateWithoutMeetingsInput, MeetingRoomUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutMeetingsInput
    connect?: MeetingRoomWhereUniqueInput
  }

  export type ParticipantCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput> | ParticipantCreateWithoutMeetingInput[] | ParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutMeetingInput | ParticipantCreateOrConnectWithoutMeetingInput[]
    createMany?: ParticipantCreateManyMeetingInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type TranscriptCreateNestedOneWithoutMeetingInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    connect?: TranscriptWhereUniqueInput
  }

  export type MeetingSummaryCreateNestedOneWithoutMeetingInput = {
    create?: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MeetingSummaryCreateOrConnectWithoutMeetingInput
    connect?: MeetingSummaryWhereUniqueInput
  }

  export type RecordingCreateNestedManyWithoutMeetingInput = {
    create?: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput> | RecordingCreateWithoutMeetingInput[] | RecordingUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutMeetingInput | RecordingCreateOrConnectWithoutMeetingInput[]
    createMany?: RecordingCreateManyMeetingInputEnvelope
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
  }

  export type ExportCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput> | ExportCreateWithoutMeetingInput[] | ExportUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ExportCreateOrConnectWithoutMeetingInput | ExportCreateOrConnectWithoutMeetingInput[]
    createMany?: ExportCreateManyMeetingInputEnvelope
    connect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
  }

  export type ParticipantUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput> | ParticipantCreateWithoutMeetingInput[] | ParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutMeetingInput | ParticipantCreateOrConnectWithoutMeetingInput[]
    createMany?: ParticipantCreateManyMeetingInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type TranscriptUncheckedCreateNestedOneWithoutMeetingInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    connect?: TranscriptWhereUniqueInput
  }

  export type MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput = {
    create?: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MeetingSummaryCreateOrConnectWithoutMeetingInput
    connect?: MeetingSummaryWhereUniqueInput
  }

  export type RecordingUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput> | RecordingCreateWithoutMeetingInput[] | RecordingUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutMeetingInput | RecordingCreateOrConnectWithoutMeetingInput[]
    createMany?: RecordingCreateManyMeetingInputEnvelope
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
  }

  export type ExportUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput> | ExportCreateWithoutMeetingInput[] | ExportUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ExportCreateOrConnectWithoutMeetingInput | ExportCreateOrConnectWithoutMeetingInput[]
    createMany?: ExportCreateManyMeetingInputEnvelope
    connect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput = {
    create?: XOR<MeetingRoomCreateWithoutMeetingsInput, MeetingRoomUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: MeetingRoomCreateOrConnectWithoutMeetingsInput
    upsert?: MeetingRoomUpsertWithoutMeetingsInput
    connect?: MeetingRoomWhereUniqueInput
    update?: XOR<XOR<MeetingRoomUpdateToOneWithWhereWithoutMeetingsInput, MeetingRoomUpdateWithoutMeetingsInput>, MeetingRoomUncheckedUpdateWithoutMeetingsInput>
  }

  export type ParticipantUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput> | ParticipantCreateWithoutMeetingInput[] | ParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutMeetingInput | ParticipantCreateOrConnectWithoutMeetingInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutMeetingInput | ParticipantUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ParticipantCreateManyMeetingInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutMeetingInput | ParticipantUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutMeetingInput | ParticipantUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type TranscriptUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    upsert?: TranscriptUpsertWithoutMeetingInput
    disconnect?: TranscriptWhereInput | boolean
    delete?: TranscriptWhereInput | boolean
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutMeetingInput, TranscriptUpdateWithoutMeetingInput>, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type MeetingSummaryUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MeetingSummaryCreateOrConnectWithoutMeetingInput
    upsert?: MeetingSummaryUpsertWithoutMeetingInput
    disconnect?: MeetingSummaryWhereInput | boolean
    delete?: MeetingSummaryWhereInput | boolean
    connect?: MeetingSummaryWhereUniqueInput
    update?: XOR<XOR<MeetingSummaryUpdateToOneWithWhereWithoutMeetingInput, MeetingSummaryUpdateWithoutMeetingInput>, MeetingSummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type RecordingUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput> | RecordingCreateWithoutMeetingInput[] | RecordingUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutMeetingInput | RecordingCreateOrConnectWithoutMeetingInput[]
    upsert?: RecordingUpsertWithWhereUniqueWithoutMeetingInput | RecordingUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: RecordingCreateManyMeetingInputEnvelope
    set?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    disconnect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    delete?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    update?: RecordingUpdateWithWhereUniqueWithoutMeetingInput | RecordingUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: RecordingUpdateManyWithWhereWithoutMeetingInput | RecordingUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
  }

  export type ExportUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput> | ExportCreateWithoutMeetingInput[] | ExportUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ExportCreateOrConnectWithoutMeetingInput | ExportCreateOrConnectWithoutMeetingInput[]
    upsert?: ExportUpsertWithWhereUniqueWithoutMeetingInput | ExportUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ExportCreateManyMeetingInputEnvelope
    set?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    disconnect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    delete?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    connect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    update?: ExportUpdateWithWhereUniqueWithoutMeetingInput | ExportUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ExportUpdateManyWithWhereWithoutMeetingInput | ExportUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ExportScalarWhereInput | ExportScalarWhereInput[]
  }

  export type ParticipantUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput> | ParticipantCreateWithoutMeetingInput[] | ParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutMeetingInput | ParticipantCreateOrConnectWithoutMeetingInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutMeetingInput | ParticipantUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ParticipantCreateManyMeetingInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutMeetingInput | ParticipantUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutMeetingInput | ParticipantUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type TranscriptUncheckedUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    upsert?: TranscriptUpsertWithoutMeetingInput
    disconnect?: TranscriptWhereInput | boolean
    delete?: TranscriptWhereInput | boolean
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutMeetingInput, TranscriptUpdateWithoutMeetingInput>, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MeetingSummaryCreateOrConnectWithoutMeetingInput
    upsert?: MeetingSummaryUpsertWithoutMeetingInput
    disconnect?: MeetingSummaryWhereInput | boolean
    delete?: MeetingSummaryWhereInput | boolean
    connect?: MeetingSummaryWhereUniqueInput
    update?: XOR<XOR<MeetingSummaryUpdateToOneWithWhereWithoutMeetingInput, MeetingSummaryUpdateWithoutMeetingInput>, MeetingSummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type RecordingUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput> | RecordingCreateWithoutMeetingInput[] | RecordingUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutMeetingInput | RecordingCreateOrConnectWithoutMeetingInput[]
    upsert?: RecordingUpsertWithWhereUniqueWithoutMeetingInput | RecordingUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: RecordingCreateManyMeetingInputEnvelope
    set?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    disconnect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    delete?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    update?: RecordingUpdateWithWhereUniqueWithoutMeetingInput | RecordingUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: RecordingUpdateManyWithWhereWithoutMeetingInput | RecordingUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
  }

  export type ExportUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput> | ExportCreateWithoutMeetingInput[] | ExportUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ExportCreateOrConnectWithoutMeetingInput | ExportCreateOrConnectWithoutMeetingInput[]
    upsert?: ExportUpsertWithWhereUniqueWithoutMeetingInput | ExportUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ExportCreateManyMeetingInputEnvelope
    set?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    disconnect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    delete?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    connect?: ExportWhereUniqueInput | ExportWhereUniqueInput[]
    update?: ExportUpdateWithWhereUniqueWithoutMeetingInput | ExportUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ExportUpdateManyWithWhereWithoutMeetingInput | ExportUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ExportScalarWhereInput | ExportScalarWhereInput[]
  }

  export type MeetingCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutParticipantsInput
    connect?: MeetingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<UserCreateWithoutParticipantsInput, UserUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutParticipantsInput
    connect?: UserWhereUniqueInput
  }

  export type ParticipantSessionCreateNestedManyWithoutParticipantInput = {
    create?: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput> | ParticipantSessionCreateWithoutParticipantInput[] | ParticipantSessionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: ParticipantSessionCreateOrConnectWithoutParticipantInput | ParticipantSessionCreateOrConnectWithoutParticipantInput[]
    createMany?: ParticipantSessionCreateManyParticipantInputEnvelope
    connect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
  }

  export type TranscriptSegmentCreateNestedManyWithoutParticipantInput = {
    create?: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput> | TranscriptSegmentCreateWithoutParticipantInput[] | TranscriptSegmentUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutParticipantInput | TranscriptSegmentCreateOrConnectWithoutParticipantInput[]
    createMany?: TranscriptSegmentCreateManyParticipantInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type RecordingCreateNestedManyWithoutParticipantInput = {
    create?: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput> | RecordingCreateWithoutParticipantInput[] | RecordingUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutParticipantInput | RecordingCreateOrConnectWithoutParticipantInput[]
    createMany?: RecordingCreateManyParticipantInputEnvelope
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
  }

  export type ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput> | ParticipantSessionCreateWithoutParticipantInput[] | ParticipantSessionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: ParticipantSessionCreateOrConnectWithoutParticipantInput | ParticipantSessionCreateOrConnectWithoutParticipantInput[]
    createMany?: ParticipantSessionCreateManyParticipantInputEnvelope
    connect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
  }

  export type TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput> | TranscriptSegmentCreateWithoutParticipantInput[] | TranscriptSegmentUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutParticipantInput | TranscriptSegmentCreateOrConnectWithoutParticipantInput[]
    createMany?: TranscriptSegmentCreateManyParticipantInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type RecordingUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput> | RecordingCreateWithoutParticipantInput[] | RecordingUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutParticipantInput | RecordingCreateOrConnectWithoutParticipantInput[]
    createMany?: RecordingCreateManyParticipantInputEnvelope
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
  }

  export type MeetingUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutParticipantsInput
    upsert?: MeetingUpsertWithoutParticipantsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutParticipantsInput, MeetingUpdateWithoutParticipantsInput>, MeetingUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneWithoutParticipantsNestedInput = {
    create?: XOR<UserCreateWithoutParticipantsInput, UserUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutParticipantsInput
    upsert?: UserUpsertWithoutParticipantsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutParticipantsInput, UserUpdateWithoutParticipantsInput>, UserUncheckedUpdateWithoutParticipantsInput>
  }

  export type ParticipantSessionUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput> | ParticipantSessionCreateWithoutParticipantInput[] | ParticipantSessionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: ParticipantSessionCreateOrConnectWithoutParticipantInput | ParticipantSessionCreateOrConnectWithoutParticipantInput[]
    upsert?: ParticipantSessionUpsertWithWhereUniqueWithoutParticipantInput | ParticipantSessionUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: ParticipantSessionCreateManyParticipantInputEnvelope
    set?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    disconnect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    delete?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    connect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    update?: ParticipantSessionUpdateWithWhereUniqueWithoutParticipantInput | ParticipantSessionUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: ParticipantSessionUpdateManyWithWhereWithoutParticipantInput | ParticipantSessionUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: ParticipantSessionScalarWhereInput | ParticipantSessionScalarWhereInput[]
  }

  export type TranscriptSegmentUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput> | TranscriptSegmentCreateWithoutParticipantInput[] | TranscriptSegmentUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutParticipantInput | TranscriptSegmentCreateOrConnectWithoutParticipantInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutParticipantInput | TranscriptSegmentUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: TranscriptSegmentCreateManyParticipantInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutParticipantInput | TranscriptSegmentUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutParticipantInput | TranscriptSegmentUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type RecordingUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput> | RecordingCreateWithoutParticipantInput[] | RecordingUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutParticipantInput | RecordingCreateOrConnectWithoutParticipantInput[]
    upsert?: RecordingUpsertWithWhereUniqueWithoutParticipantInput | RecordingUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: RecordingCreateManyParticipantInputEnvelope
    set?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    disconnect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    delete?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    update?: RecordingUpdateWithWhereUniqueWithoutParticipantInput | RecordingUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: RecordingUpdateManyWithWhereWithoutParticipantInput | RecordingUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput> | ParticipantSessionCreateWithoutParticipantInput[] | ParticipantSessionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: ParticipantSessionCreateOrConnectWithoutParticipantInput | ParticipantSessionCreateOrConnectWithoutParticipantInput[]
    upsert?: ParticipantSessionUpsertWithWhereUniqueWithoutParticipantInput | ParticipantSessionUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: ParticipantSessionCreateManyParticipantInputEnvelope
    set?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    disconnect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    delete?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    connect?: ParticipantSessionWhereUniqueInput | ParticipantSessionWhereUniqueInput[]
    update?: ParticipantSessionUpdateWithWhereUniqueWithoutParticipantInput | ParticipantSessionUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: ParticipantSessionUpdateManyWithWhereWithoutParticipantInput | ParticipantSessionUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: ParticipantSessionScalarWhereInput | ParticipantSessionScalarWhereInput[]
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput> | TranscriptSegmentCreateWithoutParticipantInput[] | TranscriptSegmentUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutParticipantInput | TranscriptSegmentCreateOrConnectWithoutParticipantInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutParticipantInput | TranscriptSegmentUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: TranscriptSegmentCreateManyParticipantInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutParticipantInput | TranscriptSegmentUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutParticipantInput | TranscriptSegmentUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type RecordingUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput> | RecordingCreateWithoutParticipantInput[] | RecordingUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: RecordingCreateOrConnectWithoutParticipantInput | RecordingCreateOrConnectWithoutParticipantInput[]
    upsert?: RecordingUpsertWithWhereUniqueWithoutParticipantInput | RecordingUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: RecordingCreateManyParticipantInputEnvelope
    set?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    disconnect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    delete?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    connect?: RecordingWhereUniqueInput | RecordingWhereUniqueInput[]
    update?: RecordingUpdateWithWhereUniqueWithoutParticipantInput | RecordingUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: RecordingUpdateManyWithWhereWithoutParticipantInput | RecordingUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
  }

  export type ParticipantCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ParticipantCreateWithoutSessionsInput, ParticipantUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutSessionsInput
    connect?: ParticipantWhereUniqueInput
  }

  export type ParticipantUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<ParticipantCreateWithoutSessionsInput, ParticipantUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutSessionsInput
    upsert?: ParticipantUpsertWithoutSessionsInput
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutSessionsInput, ParticipantUpdateWithoutSessionsInput>, ParticipantUncheckedUpdateWithoutSessionsInput>
  }

  export type MeetingCreateNestedOneWithoutTranscriptInput = {
    create?: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutTranscriptInput
    connect?: MeetingWhereUniqueInput
  }

  export type TranscriptSegmentCreateNestedManyWithoutTranscriptInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type MeetingUpdateOneRequiredWithoutTranscriptNestedInput = {
    create?: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutTranscriptInput
    upsert?: MeetingUpsertWithoutTranscriptInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutTranscriptInput, MeetingUpdateWithoutTranscriptInput>, MeetingUncheckedUpdateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateManyWithoutTranscriptNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput | TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput | TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type TranscriptCreateNestedOneWithoutSegmentsInput = {
    create?: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutSegmentsInput
    connect?: TranscriptWhereUniqueInput
  }

  export type ParticipantCreateNestedOneWithoutSegmentsInput = {
    create?: XOR<ParticipantCreateWithoutSegmentsInput, ParticipantUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutSegmentsInput
    connect?: ParticipantWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TranscriptUpdateOneRequiredWithoutSegmentsNestedInput = {
    create?: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutSegmentsInput
    upsert?: TranscriptUpsertWithoutSegmentsInput
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutSegmentsInput, TranscriptUpdateWithoutSegmentsInput>, TranscriptUncheckedUpdateWithoutSegmentsInput>
  }

  export type ParticipantUpdateOneRequiredWithoutSegmentsNestedInput = {
    create?: XOR<ParticipantCreateWithoutSegmentsInput, ParticipantUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutSegmentsInput
    upsert?: ParticipantUpsertWithoutSegmentsInput
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutSegmentsInput, ParticipantUpdateWithoutSegmentsInput>, ParticipantUncheckedUpdateWithoutSegmentsInput>
  }

  export type MeetingCreateNestedOneWithoutSummaryInput = {
    create?: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutSummaryInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutSummaryNestedInput = {
    create?: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutSummaryInput
    upsert?: MeetingUpsertWithoutSummaryInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutSummaryInput, MeetingUpdateWithoutSummaryInput>, MeetingUncheckedUpdateWithoutSummaryInput>
  }

  export type MeetingCreateNestedOneWithoutRecordingsInput = {
    create?: XOR<MeetingCreateWithoutRecordingsInput, MeetingUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutRecordingsInput
    connect?: MeetingWhereUniqueInput
  }

  export type ParticipantCreateNestedOneWithoutRecordingsInput = {
    create?: XOR<ParticipantCreateWithoutRecordingsInput, ParticipantUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutRecordingsInput
    connect?: ParticipantWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type MeetingUpdateOneRequiredWithoutRecordingsNestedInput = {
    create?: XOR<MeetingCreateWithoutRecordingsInput, MeetingUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutRecordingsInput
    upsert?: MeetingUpsertWithoutRecordingsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutRecordingsInput, MeetingUpdateWithoutRecordingsInput>, MeetingUncheckedUpdateWithoutRecordingsInput>
  }

  export type ParticipantUpdateOneWithoutRecordingsNestedInput = {
    create?: XOR<ParticipantCreateWithoutRecordingsInput, ParticipantUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutRecordingsInput
    upsert?: ParticipantUpsertWithoutRecordingsInput
    disconnect?: ParticipantWhereInput | boolean
    delete?: ParticipantWhereInput | boolean
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutRecordingsInput, ParticipantUpdateWithoutRecordingsInput>, ParticipantUncheckedUpdateWithoutRecordingsInput>
  }

  export type MeetingCreateNestedOneWithoutExportsInput = {
    create?: XOR<MeetingCreateWithoutExportsInput, MeetingUncheckedCreateWithoutExportsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutExportsInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutExportsNestedInput = {
    create?: XOR<MeetingCreateWithoutExportsInput, MeetingUncheckedCreateWithoutExportsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutExportsInput
    upsert?: MeetingUpsertWithoutExportsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutExportsInput, MeetingUpdateWithoutExportsInput>, MeetingUncheckedUpdateWithoutExportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type MeetingRoomCreateWithoutHostInput = {
    id?: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meetings?: MeetingCreateNestedManyWithoutRoomInput
  }

  export type MeetingRoomUncheckedCreateWithoutHostInput = {
    id?: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meetings?: MeetingUncheckedCreateNestedManyWithoutRoomInput
  }

  export type MeetingRoomCreateOrConnectWithoutHostInput = {
    where: MeetingRoomWhereUniqueInput
    create: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput>
  }

  export type MeetingRoomCreateManyHostInputEnvelope = {
    data: MeetingRoomCreateManyHostInput | MeetingRoomCreateManyHostInput[]
    skipDuplicates?: boolean
  }

  export type ParticipantCreateWithoutUserInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
    sessions?: ParticipantSessionCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentCreateNestedManyWithoutParticipantInput
    recordings?: RecordingCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    meetingId: string
    displayName: string
    createdAt?: Date | string
    sessions?: ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutUserInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput>
  }

  export type ParticipantCreateManyUserInputEnvelope = {
    data: ParticipantCreateManyUserInput | ParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MeetingRoomUpsertWithWhereUniqueWithoutHostInput = {
    where: MeetingRoomWhereUniqueInput
    update: XOR<MeetingRoomUpdateWithoutHostInput, MeetingRoomUncheckedUpdateWithoutHostInput>
    create: XOR<MeetingRoomCreateWithoutHostInput, MeetingRoomUncheckedCreateWithoutHostInput>
  }

  export type MeetingRoomUpdateWithWhereUniqueWithoutHostInput = {
    where: MeetingRoomWhereUniqueInput
    data: XOR<MeetingRoomUpdateWithoutHostInput, MeetingRoomUncheckedUpdateWithoutHostInput>
  }

  export type MeetingRoomUpdateManyWithWhereWithoutHostInput = {
    where: MeetingRoomScalarWhereInput
    data: XOR<MeetingRoomUpdateManyMutationInput, MeetingRoomUncheckedUpdateManyWithoutHostInput>
  }

  export type MeetingRoomScalarWhereInput = {
    AND?: MeetingRoomScalarWhereInput | MeetingRoomScalarWhereInput[]
    OR?: MeetingRoomScalarWhereInput[]
    NOT?: MeetingRoomScalarWhereInput | MeetingRoomScalarWhereInput[]
    id?: StringFilter<"MeetingRoom"> | string
    hostId?: StringFilter<"MeetingRoom"> | string
    roomName?: StringFilter<"MeetingRoom"> | string
    roomHash?: StringFilter<"MeetingRoom"> | string
    maxParticipants?: IntFilter<"MeetingRoom"> | number
    status?: StringFilter<"MeetingRoom"> | string
    createdAt?: DateTimeFilter<"MeetingRoom"> | Date | string
    updatedAt?: DateTimeFilter<"MeetingRoom"> | Date | string
  }

  export type ParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutUserInput, ParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<ParticipantCreateWithoutUserInput, ParticipantUncheckedCreateWithoutUserInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutUserInput, ParticipantUncheckedUpdateWithoutUserInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutUserInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type ParticipantScalarWhereInput = {
    AND?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    OR?: ParticipantScalarWhereInput[]
    NOT?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    id?: StringFilter<"Participant"> | string
    meetingId?: StringFilter<"Participant"> | string
    userId?: StringNullableFilter<"Participant"> | string | null
    displayName?: StringFilter<"Participant"> | string
    createdAt?: DateTimeFilter<"Participant"> | Date | string
  }

  export type UserCreateWithoutRoomsInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoomsInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
  }

  export type MeetingCreateWithoutRoomInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutRoomInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutRoomInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput>
  }

  export type MeetingCreateManyRoomInputEnvelope = {
    data: MeetingCreateManyRoomInput | MeetingCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRoomsInput = {
    update: XOR<UserUpdateWithoutRoomsInput, UserUncheckedUpdateWithoutRoomsInput>
    create: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRoomsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRoomsInput, UserUncheckedUpdateWithoutRoomsInput>
  }

  export type UserUpdateWithoutRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MeetingUpsertWithWhereUniqueWithoutRoomInput = {
    where: MeetingWhereUniqueInput
    update: XOR<MeetingUpdateWithoutRoomInput, MeetingUncheckedUpdateWithoutRoomInput>
    create: XOR<MeetingCreateWithoutRoomInput, MeetingUncheckedCreateWithoutRoomInput>
  }

  export type MeetingUpdateWithWhereUniqueWithoutRoomInput = {
    where: MeetingWhereUniqueInput
    data: XOR<MeetingUpdateWithoutRoomInput, MeetingUncheckedUpdateWithoutRoomInput>
  }

  export type MeetingUpdateManyWithWhereWithoutRoomInput = {
    where: MeetingScalarWhereInput
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyWithoutRoomInput>
  }

  export type MeetingScalarWhereInput = {
    AND?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
    OR?: MeetingScalarWhereInput[]
    NOT?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
    id?: StringFilter<"Meeting"> | string
    roomId?: StringFilter<"Meeting"> | string
    startedAt?: DateTimeFilter<"Meeting"> | Date | string
    endedAt?: DateTimeNullableFilter<"Meeting"> | Date | string | null
    durationSeconds?: IntNullableFilter<"Meeting"> | number | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
  }

  export type MeetingRoomCreateWithoutMeetingsInput = {
    id?: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    host: UserCreateNestedOneWithoutRoomsInput
  }

  export type MeetingRoomUncheckedCreateWithoutMeetingsInput = {
    id?: string
    hostId: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MeetingRoomCreateOrConnectWithoutMeetingsInput = {
    where: MeetingRoomWhereUniqueInput
    create: XOR<MeetingRoomCreateWithoutMeetingsInput, MeetingRoomUncheckedCreateWithoutMeetingsInput>
  }

  export type ParticipantCreateWithoutMeetingInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutParticipantsInput
    sessions?: ParticipantSessionCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentCreateNestedManyWithoutParticipantInput
    recordings?: RecordingCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutMeetingInput = {
    id?: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
    sessions?: ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutMeetingInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput>
  }

  export type ParticipantCreateManyMeetingInputEnvelope = {
    data: ParticipantCreateManyMeetingInput | ParticipantCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type TranscriptCreateWithoutMeetingInput = {
    id?: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
    segments?: TranscriptSegmentCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateWithoutMeetingInput = {
    id?: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptCreateOrConnectWithoutMeetingInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
  }

  export type MeetingSummaryCreateWithoutMeetingInput = {
    id?: string
    aiSummary: string
    editedSummary?: string | null
    llmModel: string
    generatedAt: Date | string
    editedAt?: Date | string | null
  }

  export type MeetingSummaryUncheckedCreateWithoutMeetingInput = {
    id?: string
    aiSummary: string
    editedSummary?: string | null
    llmModel: string
    generatedAt: Date | string
    editedAt?: Date | string | null
  }

  export type MeetingSummaryCreateOrConnectWithoutMeetingInput = {
    where: MeetingSummaryWhereUniqueInput
    create: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
  }

  export type RecordingCreateWithoutMeetingInput = {
    id?: string
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
    participant?: ParticipantCreateNestedOneWithoutRecordingsInput
  }

  export type RecordingUncheckedCreateWithoutMeetingInput = {
    id?: string
    participantId?: string | null
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type RecordingCreateOrConnectWithoutMeetingInput = {
    where: RecordingWhereUniqueInput
    create: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput>
  }

  export type RecordingCreateManyMeetingInputEnvelope = {
    data: RecordingCreateManyMeetingInput | RecordingCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type ExportCreateWithoutMeetingInput = {
    id?: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
  }

  export type ExportUncheckedCreateWithoutMeetingInput = {
    id?: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
  }

  export type ExportCreateOrConnectWithoutMeetingInput = {
    where: ExportWhereUniqueInput
    create: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput>
  }

  export type ExportCreateManyMeetingInputEnvelope = {
    data: ExportCreateManyMeetingInput | ExportCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type MeetingRoomUpsertWithoutMeetingsInput = {
    update: XOR<MeetingRoomUpdateWithoutMeetingsInput, MeetingRoomUncheckedUpdateWithoutMeetingsInput>
    create: XOR<MeetingRoomCreateWithoutMeetingsInput, MeetingRoomUncheckedCreateWithoutMeetingsInput>
    where?: MeetingRoomWhereInput
  }

  export type MeetingRoomUpdateToOneWithWhereWithoutMeetingsInput = {
    where?: MeetingRoomWhereInput
    data: XOR<MeetingRoomUpdateWithoutMeetingsInput, MeetingRoomUncheckedUpdateWithoutMeetingsInput>
  }

  export type MeetingRoomUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    host?: UserUpdateOneRequiredWithoutRoomsNestedInput
  }

  export type MeetingRoomUncheckedUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUpsertWithWhereUniqueWithoutMeetingInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutMeetingInput, ParticipantUncheckedUpdateWithoutMeetingInput>
    create: XOR<ParticipantCreateWithoutMeetingInput, ParticipantUncheckedCreateWithoutMeetingInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutMeetingInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutMeetingInput, ParticipantUncheckedUpdateWithoutMeetingInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutMeetingInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutMeetingInput>
  }

  export type TranscriptUpsertWithoutMeetingInput = {
    update: XOR<TranscriptUpdateWithoutMeetingInput, TranscriptUncheckedUpdateWithoutMeetingInput>
    create: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    where?: TranscriptWhereInput
  }

  export type TranscriptUpdateToOneWithWhereWithoutMeetingInput = {
    where?: TranscriptWhereInput
    data: XOR<TranscriptUpdateWithoutMeetingInput, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type TranscriptUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput
  }

  export type MeetingSummaryUpsertWithoutMeetingInput = {
    update: XOR<MeetingSummaryUpdateWithoutMeetingInput, MeetingSummaryUncheckedUpdateWithoutMeetingInput>
    create: XOR<MeetingSummaryCreateWithoutMeetingInput, MeetingSummaryUncheckedCreateWithoutMeetingInput>
    where?: MeetingSummaryWhereInput
  }

  export type MeetingSummaryUpdateToOneWithWhereWithoutMeetingInput = {
    where?: MeetingSummaryWhereInput
    data: XOR<MeetingSummaryUpdateWithoutMeetingInput, MeetingSummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type MeetingSummaryUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MeetingSummaryUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    editedSummary?: NullableStringFieldUpdateOperationsInput | string | null
    llmModel?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RecordingUpsertWithWhereUniqueWithoutMeetingInput = {
    where: RecordingWhereUniqueInput
    update: XOR<RecordingUpdateWithoutMeetingInput, RecordingUncheckedUpdateWithoutMeetingInput>
    create: XOR<RecordingCreateWithoutMeetingInput, RecordingUncheckedCreateWithoutMeetingInput>
  }

  export type RecordingUpdateWithWhereUniqueWithoutMeetingInput = {
    where: RecordingWhereUniqueInput
    data: XOR<RecordingUpdateWithoutMeetingInput, RecordingUncheckedUpdateWithoutMeetingInput>
  }

  export type RecordingUpdateManyWithWhereWithoutMeetingInput = {
    where: RecordingScalarWhereInput
    data: XOR<RecordingUpdateManyMutationInput, RecordingUncheckedUpdateManyWithoutMeetingInput>
  }

  export type RecordingScalarWhereInput = {
    AND?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
    OR?: RecordingScalarWhereInput[]
    NOT?: RecordingScalarWhereInput | RecordingScalarWhereInput[]
    id?: StringFilter<"Recording"> | string
    meetingId?: StringFilter<"Recording"> | string
    participantId?: StringNullableFilter<"Recording"> | string | null
    fileName?: StringFilter<"Recording"> | string
    objectKey?: StringFilter<"Recording"> | string
    startOffsetSeconds?: FloatNullableFilter<"Recording"> | number | null
    durationSeconds?: IntNullableFilter<"Recording"> | number | null
    fileSize?: BigIntFilter<"Recording"> | bigint | number
    mimeType?: StringFilter<"Recording"> | string
    createdAt?: DateTimeFilter<"Recording"> | Date | string
  }

  export type ExportUpsertWithWhereUniqueWithoutMeetingInput = {
    where: ExportWhereUniqueInput
    update: XOR<ExportUpdateWithoutMeetingInput, ExportUncheckedUpdateWithoutMeetingInput>
    create: XOR<ExportCreateWithoutMeetingInput, ExportUncheckedCreateWithoutMeetingInput>
  }

  export type ExportUpdateWithWhereUniqueWithoutMeetingInput = {
    where: ExportWhereUniqueInput
    data: XOR<ExportUpdateWithoutMeetingInput, ExportUncheckedUpdateWithoutMeetingInput>
  }

  export type ExportUpdateManyWithWhereWithoutMeetingInput = {
    where: ExportScalarWhereInput
    data: XOR<ExportUpdateManyMutationInput, ExportUncheckedUpdateManyWithoutMeetingInput>
  }

  export type ExportScalarWhereInput = {
    AND?: ExportScalarWhereInput | ExportScalarWhereInput[]
    OR?: ExportScalarWhereInput[]
    NOT?: ExportScalarWhereInput | ExportScalarWhereInput[]
    id?: StringFilter<"Export"> | string
    meetingId?: StringFilter<"Export"> | string
    exportFormat?: StringFilter<"Export"> | string
    filePath?: StringFilter<"Export"> | string
    exportedAt?: DateTimeFilter<"Export"> | Date | string
  }

  export type MeetingCreateWithoutParticipantsInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutParticipantsInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutParticipantsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutParticipantsInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: MeetingRoomCreateNestedManyWithoutHostInput
  }

  export type UserUncheckedCreateWithoutParticipantsInput = {
    id?: string
    email: string
    password: string
    fullname?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: MeetingRoomUncheckedCreateNestedManyWithoutHostInput
  }

  export type UserCreateOrConnectWithoutParticipantsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutParticipantsInput, UserUncheckedCreateWithoutParticipantsInput>
  }

  export type ParticipantSessionCreateWithoutParticipantInput = {
    id?: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
  }

  export type ParticipantSessionUncheckedCreateWithoutParticipantInput = {
    id?: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
  }

  export type ParticipantSessionCreateOrConnectWithoutParticipantInput = {
    where: ParticipantSessionWhereUniqueInput
    create: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput>
  }

  export type ParticipantSessionCreateManyParticipantInputEnvelope = {
    data: ParticipantSessionCreateManyParticipantInput | ParticipantSessionCreateManyParticipantInput[]
    skipDuplicates?: boolean
  }

  export type TranscriptSegmentCreateWithoutParticipantInput = {
    id?: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
    transcript: TranscriptCreateNestedOneWithoutSegmentsInput
  }

  export type TranscriptSegmentUncheckedCreateWithoutParticipantInput = {
    id?: string
    transcriptId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type TranscriptSegmentCreateOrConnectWithoutParticipantInput = {
    where: TranscriptSegmentWhereUniqueInput
    create: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput>
  }

  export type TranscriptSegmentCreateManyParticipantInputEnvelope = {
    data: TranscriptSegmentCreateManyParticipantInput | TranscriptSegmentCreateManyParticipantInput[]
    skipDuplicates?: boolean
  }

  export type RecordingCreateWithoutParticipantInput = {
    id?: string
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutRecordingsInput
  }

  export type RecordingUncheckedCreateWithoutParticipantInput = {
    id?: string
    meetingId: string
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type RecordingCreateOrConnectWithoutParticipantInput = {
    where: RecordingWhereUniqueInput
    create: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput>
  }

  export type RecordingCreateManyParticipantInputEnvelope = {
    data: RecordingCreateManyParticipantInput | RecordingCreateManyParticipantInput[]
    skipDuplicates?: boolean
  }

  export type MeetingUpsertWithoutParticipantsInput = {
    update: XOR<MeetingUpdateWithoutParticipantsInput, MeetingUncheckedUpdateWithoutParticipantsInput>
    create: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutParticipantsInput, MeetingUncheckedUpdateWithoutParticipantsInput>
  }

  export type MeetingUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type UserUpsertWithoutParticipantsInput = {
    update: XOR<UserUpdateWithoutParticipantsInput, UserUncheckedUpdateWithoutParticipantsInput>
    create: XOR<UserCreateWithoutParticipantsInput, UserUncheckedCreateWithoutParticipantsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutParticipantsInput, UserUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: MeetingRoomUpdateManyWithoutHostNestedInput
  }

  export type UserUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: MeetingRoomUncheckedUpdateManyWithoutHostNestedInput
  }

  export type ParticipantSessionUpsertWithWhereUniqueWithoutParticipantInput = {
    where: ParticipantSessionWhereUniqueInput
    update: XOR<ParticipantSessionUpdateWithoutParticipantInput, ParticipantSessionUncheckedUpdateWithoutParticipantInput>
    create: XOR<ParticipantSessionCreateWithoutParticipantInput, ParticipantSessionUncheckedCreateWithoutParticipantInput>
  }

  export type ParticipantSessionUpdateWithWhereUniqueWithoutParticipantInput = {
    where: ParticipantSessionWhereUniqueInput
    data: XOR<ParticipantSessionUpdateWithoutParticipantInput, ParticipantSessionUncheckedUpdateWithoutParticipantInput>
  }

  export type ParticipantSessionUpdateManyWithWhereWithoutParticipantInput = {
    where: ParticipantSessionScalarWhereInput
    data: XOR<ParticipantSessionUpdateManyMutationInput, ParticipantSessionUncheckedUpdateManyWithoutParticipantInput>
  }

  export type ParticipantSessionScalarWhereInput = {
    AND?: ParticipantSessionScalarWhereInput | ParticipantSessionScalarWhereInput[]
    OR?: ParticipantSessionScalarWhereInput[]
    NOT?: ParticipantSessionScalarWhereInput | ParticipantSessionScalarWhereInput[]
    id?: StringFilter<"ParticipantSession"> | string
    participantId?: StringFilter<"ParticipantSession"> | string
    joinedAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    lastSeenAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    leftAt?: DateTimeNullableFilter<"ParticipantSession"> | Date | string | null
    durationSeconds?: IntNullableFilter<"ParticipantSession"> | number | null
    connectionId?: StringFilter<"ParticipantSession"> | string
  }

  export type TranscriptSegmentUpsertWithWhereUniqueWithoutParticipantInput = {
    where: TranscriptSegmentWhereUniqueInput
    update: XOR<TranscriptSegmentUpdateWithoutParticipantInput, TranscriptSegmentUncheckedUpdateWithoutParticipantInput>
    create: XOR<TranscriptSegmentCreateWithoutParticipantInput, TranscriptSegmentUncheckedCreateWithoutParticipantInput>
  }

  export type TranscriptSegmentUpdateWithWhereUniqueWithoutParticipantInput = {
    where: TranscriptSegmentWhereUniqueInput
    data: XOR<TranscriptSegmentUpdateWithoutParticipantInput, TranscriptSegmentUncheckedUpdateWithoutParticipantInput>
  }

  export type TranscriptSegmentUpdateManyWithWhereWithoutParticipantInput = {
    where: TranscriptSegmentScalarWhereInput
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyWithoutParticipantInput>
  }

  export type TranscriptSegmentScalarWhereInput = {
    AND?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
    OR?: TranscriptSegmentScalarWhereInput[]
    NOT?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
    id?: StringFilter<"TranscriptSegment"> | string
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    participantId?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    spokenAt?: DateTimeFilter<"TranscriptSegment"> | Date | string
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatFilter<"TranscriptSegment"> | number
  }

  export type RecordingUpsertWithWhereUniqueWithoutParticipantInput = {
    where: RecordingWhereUniqueInput
    update: XOR<RecordingUpdateWithoutParticipantInput, RecordingUncheckedUpdateWithoutParticipantInput>
    create: XOR<RecordingCreateWithoutParticipantInput, RecordingUncheckedCreateWithoutParticipantInput>
  }

  export type RecordingUpdateWithWhereUniqueWithoutParticipantInput = {
    where: RecordingWhereUniqueInput
    data: XOR<RecordingUpdateWithoutParticipantInput, RecordingUncheckedUpdateWithoutParticipantInput>
  }

  export type RecordingUpdateManyWithWhereWithoutParticipantInput = {
    where: RecordingScalarWhereInput
    data: XOR<RecordingUpdateManyMutationInput, RecordingUncheckedUpdateManyWithoutParticipantInput>
  }

  export type ParticipantCreateWithoutSessionsInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
    user?: UserCreateNestedOneWithoutParticipantsInput
    segments?: TranscriptSegmentCreateNestedManyWithoutParticipantInput
    recordings?: RecordingCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutSessionsInput = {
    id?: string
    meetingId: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutSessionsInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutSessionsInput, ParticipantUncheckedCreateWithoutSessionsInput>
  }

  export type ParticipantUpsertWithoutSessionsInput = {
    update: XOR<ParticipantUpdateWithoutSessionsInput, ParticipantUncheckedUpdateWithoutSessionsInput>
    create: XOR<ParticipantCreateWithoutSessionsInput, ParticipantUncheckedCreateWithoutSessionsInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutSessionsInput, ParticipantUncheckedUpdateWithoutSessionsInput>
  }

  export type ParticipantUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneWithoutParticipantsNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type MeetingCreateWithoutTranscriptInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutTranscriptInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutTranscriptInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentCreateWithoutTranscriptInput = {
    id?: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
    participant: ParticipantCreateNestedOneWithoutSegmentsInput
  }

  export type TranscriptSegmentUncheckedCreateWithoutTranscriptInput = {
    id?: string
    participantId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type TranscriptSegmentCreateOrConnectWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    create: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentCreateManyTranscriptInputEnvelope = {
    data: TranscriptSegmentCreateManyTranscriptInput | TranscriptSegmentCreateManyTranscriptInput[]
    skipDuplicates?: boolean
  }

  export type MeetingUpsertWithoutTranscriptInput = {
    update: XOR<MeetingUpdateWithoutTranscriptInput, MeetingUncheckedUpdateWithoutTranscriptInput>
    create: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutTranscriptInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutTranscriptInput, MeetingUncheckedUpdateWithoutTranscriptInput>
  }

  export type MeetingUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    update: XOR<TranscriptSegmentUpdateWithoutTranscriptInput, TranscriptSegmentUncheckedUpdateWithoutTranscriptInput>
    create: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    data: XOR<TranscriptSegmentUpdateWithoutTranscriptInput, TranscriptSegmentUncheckedUpdateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput = {
    where: TranscriptSegmentScalarWhereInput
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyWithoutTranscriptInput>
  }

  export type TranscriptCreateWithoutSegmentsInput = {
    id?: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateWithoutSegmentsInput = {
    id?: string
    meetingId: string
    fullTranscript: string
    language: string
    createdAt?: Date | string
  }

  export type TranscriptCreateOrConnectWithoutSegmentsInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
  }

  export type ParticipantCreateWithoutSegmentsInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
    user?: UserCreateNestedOneWithoutParticipantsInput
    sessions?: ParticipantSessionCreateNestedManyWithoutParticipantInput
    recordings?: RecordingCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutSegmentsInput = {
    id?: string
    meetingId: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
    sessions?: ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutSegmentsInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutSegmentsInput, ParticipantUncheckedCreateWithoutSegmentsInput>
  }

  export type TranscriptUpsertWithoutSegmentsInput = {
    update: XOR<TranscriptUpdateWithoutSegmentsInput, TranscriptUncheckedUpdateWithoutSegmentsInput>
    create: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    where?: TranscriptWhereInput
  }

  export type TranscriptUpdateToOneWithWhereWithoutSegmentsInput = {
    where?: TranscriptWhereInput
    data: XOR<TranscriptUpdateWithoutSegmentsInput, TranscriptUncheckedUpdateWithoutSegmentsInput>
  }

  export type TranscriptUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullTranscript?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUpsertWithoutSegmentsInput = {
    update: XOR<ParticipantUpdateWithoutSegmentsInput, ParticipantUncheckedUpdateWithoutSegmentsInput>
    create: XOR<ParticipantCreateWithoutSegmentsInput, ParticipantUncheckedCreateWithoutSegmentsInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutSegmentsInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutSegmentsInput, ParticipantUncheckedUpdateWithoutSegmentsInput>
  }

  export type ParticipantUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneWithoutParticipantsNestedInput
    sessions?: ParticipantSessionUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type MeetingCreateWithoutSummaryInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutSummaryInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutSummaryInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
  }

  export type MeetingUpsertWithoutSummaryInput = {
    update: XOR<MeetingUpdateWithoutSummaryInput, MeetingUncheckedUpdateWithoutSummaryInput>
    create: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutSummaryInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutSummaryInput, MeetingUncheckedUpdateWithoutSummaryInput>
  }

  export type MeetingUpdateWithoutSummaryInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutSummaryInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutRecordingsInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    exports?: ExportCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutRecordingsInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    exports?: ExportUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutRecordingsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutRecordingsInput, MeetingUncheckedCreateWithoutRecordingsInput>
  }

  export type ParticipantCreateWithoutRecordingsInput = {
    id?: string
    displayName: string
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
    user?: UserCreateNestedOneWithoutParticipantsInput
    sessions?: ParticipantSessionCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutRecordingsInput = {
    id?: string
    meetingId: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
    sessions?: ParticipantSessionUncheckedCreateNestedManyWithoutParticipantInput
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutRecordingsInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutRecordingsInput, ParticipantUncheckedCreateWithoutRecordingsInput>
  }

  export type MeetingUpsertWithoutRecordingsInput = {
    update: XOR<MeetingUpdateWithoutRecordingsInput, MeetingUncheckedUpdateWithoutRecordingsInput>
    create: XOR<MeetingCreateWithoutRecordingsInput, MeetingUncheckedCreateWithoutRecordingsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutRecordingsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutRecordingsInput, MeetingUncheckedUpdateWithoutRecordingsInput>
  }

  export type MeetingUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type ParticipantUpsertWithoutRecordingsInput = {
    update: XOR<ParticipantUpdateWithoutRecordingsInput, ParticipantUncheckedUpdateWithoutRecordingsInput>
    create: XOR<ParticipantCreateWithoutRecordingsInput, ParticipantUncheckedCreateWithoutRecordingsInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutRecordingsInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutRecordingsInput, ParticipantUncheckedUpdateWithoutRecordingsInput>
  }

  export type ParticipantUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneWithoutParticipantsNestedInput
    sessions?: ParticipantSessionUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type MeetingCreateWithoutExportsInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    room: MeetingRoomCreateNestedOneWithoutMeetingsInput
    participants?: ParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryCreateNestedOneWithoutMeetingInput
    recordings?: RecordingCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutExportsInput = {
    id?: string
    roomId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    summary?: MeetingSummaryUncheckedCreateNestedOneWithoutMeetingInput
    recordings?: RecordingUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutExportsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutExportsInput, MeetingUncheckedCreateWithoutExportsInput>
  }

  export type MeetingUpsertWithoutExportsInput = {
    update: XOR<MeetingUpdateWithoutExportsInput, MeetingUncheckedUpdateWithoutExportsInput>
    create: XOR<MeetingCreateWithoutExportsInput, MeetingUncheckedCreateWithoutExportsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutExportsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutExportsInput, MeetingUncheckedUpdateWithoutExportsInput>
  }

  export type MeetingUpdateWithoutExportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: MeetingRoomUpdateOneRequiredWithoutMeetingsNestedInput
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutExportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingRoomCreateManyHostInput = {
    id?: string
    roomName: string
    roomHash: string
    maxParticipants: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantCreateManyUserInput = {
    id?: string
    meetingId: string
    displayName: string
    createdAt?: Date | string
  }

  export type MeetingRoomUpdateWithoutHostInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meetings?: MeetingUpdateManyWithoutRoomNestedInput
  }

  export type MeetingRoomUncheckedUpdateWithoutHostInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meetings?: MeetingUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type MeetingRoomUncheckedUpdateManyWithoutHostInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomName?: StringFieldUpdateOperationsInput | string
    roomHash?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
    sessions?: ParticipantSessionUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingCreateManyRoomInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    durationSeconds?: number | null
    createdAt?: Date | string
  }

  export type MeetingUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUpdateManyWithoutMeetingNestedInput
    exports?: ExportUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    summary?: MeetingSummaryUncheckedUpdateOneWithoutMeetingNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutMeetingNestedInput
    exports?: ExportUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateManyMeetingInput = {
    id?: string
    userId?: string | null
    displayName: string
    createdAt?: Date | string
  }

  export type RecordingCreateManyMeetingInput = {
    id?: string
    participantId?: string | null
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type ExportCreateManyMeetingInput = {
    id?: string
    exportFormat: string
    filePath: string
    exportedAt: Date | string
  }

  export type ParticipantUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutParticipantsNestedInput
    sessions?: ParticipantSessionUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ParticipantSessionUncheckedUpdateManyWithoutParticipantNestedInput
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutParticipantNestedInput
    recordings?: RecordingUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordingUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneWithoutRecordingsNestedInput
  }

  export type RecordingUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordingUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    exportFormat?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    exportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantSessionCreateManyParticipantInput = {
    id?: string
    joinedAt: Date | string
    lastSeenAt?: Date | string
    leftAt?: Date | string | null
    durationSeconds?: number | null
    connectionId: string
  }

  export type TranscriptSegmentCreateManyParticipantInput = {
    id?: string
    transcriptId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type RecordingCreateManyParticipantInput = {
    id?: string
    meetingId: string
    fileName: string
    objectKey: string
    startOffsetSeconds?: number | null
    durationSeconds?: number | null
    fileSize: bigint | number
    mimeType: string
    createdAt?: Date | string
  }

  export type ParticipantSessionUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type ParticipantSessionUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type ParticipantSessionUncheckedUpdateManyWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    connectionId?: StringFieldUpdateOperationsInput | string
  }

  export type TranscriptSegmentUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    transcript?: TranscriptUpdateOneRequiredWithoutSegmentsNestedInput
  }

  export type TranscriptSegmentUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type RecordingUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutRecordingsNestedInput
  }

  export type RecordingUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordingUncheckedUpdateManyWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    startOffsetSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptSegmentCreateManyTranscriptInput = {
    id?: string
    participantId: string
    startTime: number
    endTime: number
    spokenAt: Date | string
    text: string
    confidence: number
  }

  export type TranscriptSegmentUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    participant?: ParticipantUpdateOneRequiredWithoutSegmentsNestedInput
  }

  export type TranscriptSegmentUncheckedUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    spokenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}