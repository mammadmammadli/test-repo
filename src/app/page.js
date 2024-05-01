'use client';
import axios from 'axios';
import srp from 'thinbus-srp/client';

const config = {
  N_base10:
    "17210721965507415415524110222294191378847175114182101251352387252491461486118196801631154120318016015323712914722411711910316161213351817175349132051277216921842538023285710523718310317620796149231542258179102265251213250170232412416915047111471848524912114723615194234168131161021924425511611589208652131956216729403068107201195920215118058352511282211818932122671081001292412101857135237026911575023013624811972846935181361762131259416712239117210236250344251219245471791209796391444229122230175135781153206834115620442812319582164286152243168208195130113174532482332192511821481812003216159122228532223510982958411715510122711425221414224215167173115874255115",
  g_base10: "2",
  k_base16: "5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300",
};

export default function Home() {
  async function sendSrpStep1(params) {
    try {
      const response = await axios.post("http://46.101.115.206:8001/api/srp/step/1", params);

      return response.data;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function sendSrpStep2(params) {
    try {
      const response = await axios.post("http://46.101.115.206:8001/api/srp/step/2", params, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Something went wrong");
    }
  }


  const handleClick = async () => {
    const response = await sendSrpStep1({
      email: "taketooaway@gmail.com"
    });

    const SRP6JavascriptClientSessionSHA256 = srp(
      config.N_base10,
      config.g_base10,
      config.k_base16
    );
    const srpClient = new SRP6JavascriptClientSessionSHA256();
    srpClient.step1("taketooaway@gmail.com", "test123");

    const credentials = srpClient.step2(response.salt, response.srpB);

    console.log({ credentials });

    const reps = await sendSrpStep2({
      email: "taketooaway@gmail.com",
      srpA: credentials.A,
      srpM1: credentials.M1,
    });

    console.log({ reps });
  }

  return (
    <div>
      <button onClick={handleClick}>Clcik</button>
    </div>
  );
}
