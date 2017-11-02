import { OpenPageOptions } from "../command";

export default function openPage({ address }: OpenPageOptions) {
    location.href = address;
}
