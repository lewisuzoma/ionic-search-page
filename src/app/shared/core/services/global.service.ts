import { Injectable } from "@angular/core";
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';

interface CloseModalParams {
    data?: any;
    role?: string;
    id?: string;
  }

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

    defaultModalConfig: any = {
        component: null,
        id: null,
        mode: "md",
        canDismiss: true,
        cssClass: "",
        componentProps: {},
    };

    constructor(
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
    ) {}

    /**
   * Opens a modal with dynamic configuration based on platform and user input.
   *
   * @param page - The component to be loaded inside the modal.
   * @param data - The data or props to be passed to the modal component.
   * @param height - The height of the modal (default: 100%). Used for breakpoint configuration.
   * @param isCenter - Determines if the modal should be centered (default: false).
   * @param cssClass - The custom CSS class to apply to the modal (default: 'modal-right').
   * @param id - Optional identifier for the modal instance.
   *
   * This function opens a modal with a configurable height, CSS class, and breakpoints.
   * It adapts to different platforms (web, tablet, native) and optionally centers the modal.
   *
   * @returns A promise that resolves once the modal is presented.
   */
  async openModal(
    page: any,
    data: object,
    height: number = 100,
    isCenter: boolean = false,
    cssClass: string = "modal-right",
    id?: any
  ) {
    let modalConfig = this.defaultModalConfig;
    modalConfig.cssClass = !isCenter ? "modal-right" : cssClass;
    modalConfig.componentProps = data;
    modalConfig.component = page;
    modalConfig.id = id;
    modalConfig.canDismiss = this.defaultModalConfig.canDismiss;
    let modal: any = await this.modalCtrl.create(modalConfig);

    await modal.present();
  }

  closeModal({ data = null, role = undefined, id }: CloseModalParams) {
    this.modalCtrl.dismiss(data, role, id);
  }

  async toastAlert(
    message: string,
    { duration = 3000} = {}
  ) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: "top",
    });
    toast.present();
  }

  updateOrAddObject(arr: any, newObj: any) {
    const nameToFind = newObj.name;
    let foundIndex = -1;
    
    // Check if an object with the same name exists
    if(arr !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === nameToFind) {
          foundIndex = i;
          break; // Exit the loop once found
        }
      }
    }
  
    if (foundIndex > -1) {
      // Object with the same name exists, so remove it
      arr.splice(foundIndex, 1);
      console.log(`Removed object with name: ${nameToFind}`);
    } else {
      console.log(`Object with name: ${nameToFind} not found.`)
    }
  
    // Add the new object to the array
    arr.push(newObj);
    console.log(`Added object:`, newObj);
    return arr; // Return the modified array
  }
  
  removeObject(arr: any, newObj: any) {
    const nameToFind = newObj.name;
    let foundIndex = -1;
    
    // Check if an object with the same name exists
    if(arr !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === nameToFind) {
          foundIndex = i;
          break; // Exit the loop once found
        }
      }
    }
  
    if (foundIndex > -1) {
      // Object with the same name exists, so remove it
      arr.splice(foundIndex, 1);
      console.log(`Removed object with name: ${nameToFind}`);
    } else {
      console.log(`Object with name: ${nameToFind} not found.`)
    }
    
    return arr; // Return the modified array
  }

  formatCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  }

  async shareInvite() {
    let data = {
      title: `Share Link`,
      text: ``,
      url: `https://univacity.com`,
      dialogTitle: 'Share with buddies',
    }
    try {
      await Share.share(data)
      console.log('Successful share')
    } catch (error) {
      console.log('Error sharing', error)
    }
  }

}