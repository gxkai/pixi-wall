import {Howl, HowlOptions} from 'howler';

export default function getHowlSound(soundName: string, props?: HowlOptions): Howl {
	const soundSource = `assets/sounds/${soundName}`;

	return new Howl({src: soundSource, ...props});
}
